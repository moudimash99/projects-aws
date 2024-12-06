#######################################
# Provider & Terraform Settings
#######################################
terraform {
  required_version = ">= 1.0.0"
  # You might add required_providers here if using specific versions
}

provider "aws" {
  region  = var.aws_region
  # Ensure credentials are set in your environment (AWS_PROFILE or env vars)
}

#######################################
# Data (Optionally to get caller info)
#######################################
data "aws_caller_identity" "current" {}

#######################################
# VPC Setup
#######################################
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Public Subnet (for EC2)
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route" "public_internet_access" {
  route_table_id         = aws_route_table.public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# Private Subnets (for RDS)
resource "aws_subnet" "private_subnet_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_subnet_a_cidr
  map_public_ip_on_launch = false
  availability_zone       = var.az_a
  tags = {
    Name = "${var.project_name}-private-subnet-a"
  }
}

resource "aws_subnet" "private_subnet_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_subnet_b_cidr
  map_public_ip_on_launch = false
  availability_zone       = var.az_b
  tags = {
    Name = "${var.project_name}-private-subnet-b"
  }
}

# We don't attach any NAT Gateway or routes for private subnets to internet 
# since we want to stay free-tier and RDS doesn't need outbound internet.

#######################################
# Security Groups
#######################################

# EC2 Security Group
resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "EC2 Security Group"
  vpc_id      = aws_vpc.main.id

  # Inbound: 
  # Port 3000 from anywhere for simplicity. For production:
  # Restrict to API Gateway CIDR or known IP ranges from docs if possible.
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  # SSH access only from your IP
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.your_ip] # Example "203.0.113.0/32"
  }

  # Outbound: open for updates, docker pulls
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}

# RDS Security Group - Only EC2 SG can connect
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "RDS Security Group"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  # Egress: default allow all
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

#######################################
# IAM Roles for EC2
#######################################
# Minimal: If you want EC2 to read from S3 or Systems Manager
# For now, we keep it simple. Just a role that allows CloudWatch logs or SSM.
resource "aws_iam_role" "ec2_role" {
  name               = "${var.project_name}-ec2-role"
  assume_role_policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "ec2.amazonaws.com"
        },
        "Effect": "Allow"
      }
    ]
  }
  EOF

  tags = {
    Name = "${var.project_name}-ec2-role"
  }
}

resource "aws_iam_role_policy_attachment" "ec2_ssm_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore" 
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

#######################################
# EBS Encryption
#######################################
# By default, if EBS encryption by default is enabled in your account, volumes will be encrypted.
# If not, we can specify kms_key_id or just rely on AWS-managed keys.
# We'll rely on the AWS-managed KMS key for simplicity.

#######################################
# EC2 Instance (Node.js Backend)
#######################################
resource "aws_instance" "app_instance" {
  ami           = var.ami_id
  instance_type = "t2.micro" # free-tier eligible
  subnet_id     = aws_subnet.public_subnet.id
  associate_public_ip_address = true
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  # Start simple user_data: install Git, Docker, Node.js (Amazon Linux repo)
  # In a real scenario, you'd clone your repo and run your Node.js app behind Docker.
  user_data = <<-EOF
  #!/bin/bash
  yum update -y
  # Install docker and git
  yum install -y docker git
  service docker start
  
  EOF

  # Enable encryption on root volume
  root_block_device {
    encrypted = true
  }

  tags = {
    Name = "${var.project_name}-ec2"
  }
}

#######################################
# RDS Subnet Group
#######################################
resource "aws_db_subnet_group" "db_subnet_group" {
  name        = "${var.project_name}-db-subnet-group"
  description = "Subnet group for RDS"
  subnet_ids  = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_b.id]

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

#######################################
# RDS Instance
#######################################
resource "aws_db_instance" "db_instance" {
  allocated_storage    = 20
  engine               = "postgres"
  # PostGIS isn't enabled via engine param, you enable the extension inside DB once up.
  # engine_version       = "14" 
  instance_class       = "db.t4g.micro" # free-tier eligible 
  db_name                 = "projectsdb"
  username             = "postgres"
  password             = var.db_password
  skip_final_snapshot  = true
  publicly_accessible  = false
  multi_az             = false
  db_subnet_group_name = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  # Encryption at rest with AWS-managed key
  storage_encrypted = true

  tags = {
    Name = "${var.project_name}-rds"
  }
}

#######################################
# API Gateway (HTTP API)
#######################################
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-http-api"
  protocol_type = "HTTP"

  tags = {
    Name = "${var.project_name}-http-api"
  }
}

resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true

  # Enable CloudWatch logging for access logs if desired:
  # (We would need a log group and permissions)
}


resource "aws_apigatewayv2_integration" "http_integration" {
  api_id                = aws_apigatewayv2_api.http_api.id
  integration_type      = "HTTP_PROXY"
  integration_method    = "ANY"
  integration_uri  = "http://${aws_instance.app_instance.public_dns}:3000"
  payload_format_version = "1.0" # For HTTP_PROXY, specify the payload format

  # Optionally, set connection type
  connection_type = "INTERNET"

  depends_on = [aws_instance.app_instance]
}
resource "aws_apigatewayv2_route" "projects_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /projects"
  target    = "integrations/${aws_apigatewayv2_integration.http_integration.id}"
}
