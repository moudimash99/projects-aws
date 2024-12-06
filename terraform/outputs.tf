output "api_endpoint" {
  value       = aws_apigatewayv2_stage.api_stage.invoke_url
  description = "Public URL for the API Gateway endpoint."
}

output "ec2_public_ip" {
  value       = aws_instance.app_instance.public_ip
  description = "Public IP of the EC2 instance."
}

output "ec2_public_dns" {
  value       = aws_instance.app_instance.public_dns
  description = "Public DNS of the EC2 instance."
}

output "rds_endpoint" {
  value       = aws_db_instance.db_instance.address
  description = "Endpoint of the RDS PostgreSQL database."
}
