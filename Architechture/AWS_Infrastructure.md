# AWS Infrastructure with Terraform

The AWS infrastructure for this application is entirely provisioned using Terraform, ensuring consistent and automated deployments while adhering to the requirement of staying within the AWS Free Tier. The architecture centers around three primary services: EC2, RDS, and API Gateway.

## 1. EC2 Instance

An EC2 instance is deployed within a public subnet to host the Node.js backend application. The instance runs Docker, which manages the Node.js app on port 3000. Utilizing Docker simplifies extending the application, enhances robustness, and streamlines deployment. By pulling the Docker image from Docker Hub, updates and modifications can be easily integrated without extensive reconfiguration. Although placing the EC2 instance in a private subnet with a NAT Gateway would enhance security, this approach was avoided to remain within the free tier limits.

## 2. RDS Database

A PostgreSQL database with the PostGIS extension is hosted on RDS within a private subnet, ensuring that the database is not directly accessible from the internet. This setup enhances security by restricting access to the database solely to the EC2 instance through tightly controlled security groups. PostGIS is leveraged for efficient geospatial queries, taking advantage of its optimized C++ functions for high-performance spatial operations.

## 3. API Gateway

An API Gateway is configured to provide a stable and secure endpoint for the application. It facilitates HTTPS communication, ensuring that all data transmitted between users and the backend is encrypted. The API Gateway proxies requests to the EC2 instance, enabling a reliable and scalable interface for client interactions.

## Security and Networking

The infrastructure includes a well-defined VPC with both public and private subnets, managed through Terraform to ensure network isolation and security. Security groups are meticulously configured to allow necessary inbound and outbound traffic while minimizing exposure. For instance, the EC2 security group permits HTTP traffic on port 3000 and SSH access from specific IP addresses, whereas the RDS security group restricts database access exclusively to the EC2 instance.

## Future Considerations

While the current setup prioritizes cost-effectiveness and simplicity within the free tier, future enhancements could include adopting NGINX for reverse proxying and potentially integrating Kubernetes for automated container deployment and scaling, should budget constraints be lifted.

In summary, the AWS infrastructure is thoughtfully designed to balance cost, security, and functionality, leveraging Terraform for automation and maintaining flexibility for future scalability.
