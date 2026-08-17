output "alb_dns_name" {
  value       = "http://${aws_lb.main.dns_name}"
  description = "Public URL of the Application Load Balancer"
}

output "cloudfront_url" {
  value       = var.enable_cloudfront ? "https://${aws_cloudfront_distribution.cdn[0].domain_name}" : "CloudFront disabled (Unverified AWS Sandbox Account)"
  description = "CloudFront CDN URL serving the static frontend and routing /api/* to ALB"
}

output "frontend_url" {
  value       = "http://${aws_s3_bucket_website_configuration.frontend_website.website_endpoint}"
  description = "Public Website URL of the frontend on AWS"
}

output "s3_frontend_bucket" {
  value       = aws_s3_bucket.frontend.id
  description = "S3 bucket name for frontend static files"
}

output "s3_attachments_bucket" {
  value       = aws_s3_bucket.attachments.id
  description = "Private S3 bucket name for file attachments"
}

output "rds_endpoint" {
  value       = aws_db_instance.rds.endpoint
  description = "Endpoint of the private RDS MySQL database"
}

output "cloudwatch_dashboard" {
  value       = aws_cloudwatch_dashboard.main.dashboard_name
  description = "Name of the CloudWatch Observability Dashboard"
}

output "vpc_id" {
  value       = aws_vpc.main.id
  description = "ID of the created VPC"
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "Name of the ECS Cluster"
}

output "ecs_service_name" {
  value       = aws_ecs_service.api.name
  description = "Name of the deployed ECS Service"
}
