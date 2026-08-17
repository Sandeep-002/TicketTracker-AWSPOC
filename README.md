# Project TicketDesk — AWS Cloud Deployment Guide

Welcome to **Project TicketDesk**! This repository contains the complete codebase and Infrastructure as Code (Terraform) to deploy the TicketDesk IT Support Tracker platform on AWS.

---

## 🏛️ System Architecture Overview

```text
Browser ──► CloudFront CDN + S3 (Static React Frontend)
               │ /api/*
               ▼
  Application Load Balancer (Public Subnets)
               │
               ▼
    ECS Fargate Tasks (Private Subnets)
         │               │
         ▼               ▼
    RDS MySQL       S3 Attachments ──► Lambda (Thumbnail Generator)
  (Private Subnet)  (Presigned URLs)
```

- **Frontend**: React SPA served via CloudFront CDN & S3 Origin Access Control (OAC).
- **API Routing**: CloudFront proxies `/api/*` requests to an Internet-facing Application Load Balancer.
- **Compute**: Spring Boot API containerized on AWS ECS Fargate running in Private Subnets.
- **Database**: Amazon RDS MySQL 8.0 running in Private Subnets (`publicly_accessible = false`).
- **Secrets & Config**: Database password stored in AWS Secrets Manager; parameters stored in SSM Parameter Store.
- **Serverless Attachments**: Direct browser uploads via S3 Presigned URLs triggering an asynchronous Python Lambda function.
- **Observability**: Centralized CloudWatch logs, Observability Dashboard, and 3 CloudWatch Alarms with SNS notifications.
- **CI/CD**: GitHub Actions pipeline enforcing secret scans (TruffleHog), unit tests, ECR build/push, ECS deployment, and smoke tests.

---

## 🚀 Quick Start Deployment Guide for New Joiners

### Prerequisites

1. Install **AWS CLI v2** and configure credentials:
   ```powershell
   aws configure
   ```
2. Install **Docker Desktop** (version 20+).
3. Install **Terraform** (version 1.0+).

---

### Step 1: Clone Repository & Build Docker Image

```powershell
# 1. Clone repository
git clone https://github.com/your-org/ticketdesk.git
cd ticketdesk

# 2. Login to Amazon ECR
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.ap-southeast-2.amazonaws.com

# 3. Create ECR Repository (if not already created)
aws ecr create-repository --repository-name tkt-ts-api --region ap-southeast-2
aws ecr put-image-scanning-configuration --repository-name tkt-ts-api --image-scanning-configuration scanOnPush=true --region ap-southeast-2

# 4. Build, Tag with Git SHA, and Push Docker Image
$GIT_SHA=$(git rev-parse --short HEAD)
docker build --platform linux/amd64 -t tkt-ts-api ./backend/api-gateway
docker tag tkt-ts-api:latest <your-account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/tkt-ts-api:$GIT_SHA
docker push <your-account-id>.dkr.ecr.ap-southeast-2.amazonaws.com/tkt-ts-api:$GIT_SHA
```

---

### Step 2: Deploy Infrastructure via Terraform

```powershell
# Navigate to terraform directory
cd terraform

# 1. Initialize Terraform
terraform init

# 2. Preview Infrastructure Plan
terraform plan

# 3. Deploy Complete Stack
terraform apply -auto-approve
```

Upon completion (~3-4 minutes), Terraform will display your production endpoints:
```text
cloudfront_url = "https://d123456789.cloudfront.net"
alb_dns_name   = "http://tkt-hs-alb-xxxxxxxx.ap-southeast-2.elb.amazonaws.com"
```

---

### Step 3: Verify & Access the Application

1. Open `cloudfront_url` in your browser.
2. Verify API Health Check: `http://<ALB_DNS>/actuator/health` (returns `{"status":"UP"}`).

---

### 🧹 Teardown Stack

To clean up all AWS resources and avoid billable charges:
```powershell
terraform destroy -auto-approve
```

---

## 📄 Project Documentation Links

- 📋 **[34-Item Deployment Readiness Checklist](CHECKLIST.md)**
- 💰 **[One-Page AWS Cost Report](cost_report.md)**
- 📖 **[Detailed Milestone Walkthrough](walkthrough.md)**
