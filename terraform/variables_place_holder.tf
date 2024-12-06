variable "project_name" {
  type        = string
  default     = "my-secure-app"
  description = "Name prefix for all resources"
}

variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS Region"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/22"
  description = "CIDR block for the VPC"
}

variable "public_subnet_cidr" {
  type        = string
  default     = "10.0.1.0/24"
  description = "CIDR for public subnet"
}

variable "private_subnet_a_cidr" {
  type        = string
  default     = "10.0.2.0/24"
  description = "CIDR for private subnet a"
}

variable "private_subnet_b_cidr" {
  type        = string
  default     = "10.0.3.0/24"
  description = "CIDR for private subnet b"
}

variable "az_a" {
  type        = string
  default     = "us-east-1a"
  description = "Availability Zone A"
}

variable "az_b" {
  type        = string
  default     = "us-east-1b"
  description = "Availability Zone B"
}

variable "your_ip" {
  type        = string
  description = "Your public IP for SSH access"
  default     = "0.0.0.0/0" # Replace with your actual IP, e.g. "203.0.113.10/32"
}

variable "ami_id" {
  type        = string
  description = "AMI for the EC2 instance"
  default     = "ami-0166fe664262f664c" # Amazon Linux 2 in us-east-1, change as needed
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "Database password for the RDS"
  default     = "mysecretpassword"
}
