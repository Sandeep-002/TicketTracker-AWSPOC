# Project TicketDesk — AWS Cost Report (Milestone M8)

## 📊 Overview
This report details the estimated monthly expenditure for deploying **Project TicketDesk** on AWS across the 9 core AWS services utilized in the architecture.

---

## 💰 Service-by-Service Monthly Cost Breakdown

| AWS Service | Resource Configuration | Estimated Monthly Spend |
| :--- | :--- | :--- |
| **AWS ECS Fargate** | 1 Task (0.5 vCPU, 1 GB RAM, 24/7) | ~$14.40 / month |
| **Amazon RDS MySQL** | `db.t3.micro` Single-AZ (20 GB GP3 Storage) | ~$17.50 / month |
| **Application Load Balancer** | 1 ALB (1 LCU average usage) | ~$18.00 / month |
| **Amazon CloudFront** | Static CDN (10 GB Outbound Data Transfer) | ~$0.85 / month |
| **Amazon S3** | Frontend Bucket + Attachments Bucket (5 GB storage) | ~$0.12 / month |
| **AWS Secrets Manager** | 1 Secret (`tkt-hs-db-credentials`) | ~$0.40 / month |
| **AWS SSM Parameter Store** | Standard parameters (`DB_URL`, `DB_USER`) | **FREE** ($0.00) |
| **Amazon ECR** | 1 Private Repository (5 GB image storage) | ~$0.50 / month |
| **AWS Lambda & CloudWatch** | Thumbnail Generator + 14-day Log Retention | ~$0.50 / month |
| **TOTAL ESTIMATED COST** | | **~$52.27 / month** |

---

## 🏆 Top 2 Most Expensive Services

1. **Application Load Balancer (ALB)** (~$18.00/month): Fixed hourly charge of $0.0225/hour regardless of traffic volume.
2. **Amazon RDS MySQL (`db.t3.micro`)** (~$17.50/month): Database instance compute charge for 24/7 uptime.

---

## 💡 Cost Optimization Recommendations for Non-Production

- **Nightly Shutdown**: Schedule a Lambda or EventBridge rule to scale ECS tasks to `0` and stop RDS instances overnight to save ~65% on compute costs.
- **ALB Sharing**: Use a shared load balancer across multiple development environments.
