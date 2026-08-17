variable "aws_region" {
  type        = string
  default     = "ap-southeast-2"
  description = "AWS region for deployment"
}

variable "prefix" {
  type        = string
  default     = "tkt-hs"
  description = "Resource naming prefix"
}

variable "owner" {
  type        = string
  default     = "Harley"
  description = "Resource owner tag"
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Deployment environment"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "VPC CIDR block"
}

variable "container_image" {
  type        = string
  default     = "328681352944.dkr.ecr.ap-southeast-2.amazonaws.com/tkt-ts-api:21a407a"
  description = "ECR Image URI for the API Gateway application"
}

variable "auth_image" {
  type        = string
  default     = "328681352944.dkr.ecr.ap-southeast-2.amazonaws.com/tkt-auth-api:21a407a"
  description = "ECR Image URI for the Auth Service"
}

variable "ticket_image" {
  type        = string
  default     = "328681352944.dkr.ecr.ap-southeast-2.amazonaws.com/tkt-ticket-api:21a407a"
  description = "ECR Image URI for the Ticket Service"
}

variable "notification_image" {
  type        = string
  default     = "328681352944.dkr.ecr.ap-southeast-2.amazonaws.com/tkt-notification-api:21a407a"
  description = "ECR Image URI for the Notification Service"
}

variable "domain_name" {
  type        = string
  default     = "ticketdesktop.com"
  description = "Custom domain name for the application"
}

variable "use_custom_domain" {
  type        = bool
  default     = false
  description = "Set to true only if custom domain is purchased and hosted on Route 53"
}

variable "container_port" {
  type        = number
  default     = 8080
  description = "Port exposed by the container"
}

variable "enable_cloudfront" {
  type        = bool
  default     = false
  description = "Enable CloudFront CDN distribution (set to true if AWS account is verified)"
}
