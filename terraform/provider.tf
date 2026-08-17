terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "TicketDesk"
      Owner       = var.owner
      Environment = var.environment
      CostCenter  = "Training"
    }
  }
}

# us-east-1 provider required for AWS Certificate Manager (ACM) with CloudFront
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  default_tags {
    tags = {
      Project     = "TicketDesk"
      Owner       = var.owner
      Environment = var.environment
      CostCenter  = "Training"
    }
  }
}
