# Deployment Readiness Checklist (34 / 34 PASSED)

This document verifies all 34 requirements from the **Project TicketDesk Capstone Brief**.

## Container & ECR
- [x] **1. Multi-stage Dockerfile**: Maven build stage -> Eclipse Temurin JRE 17 Alpine runtime stage.
- [x] **2. Container runs as a non-root user**: `USER appuser` configured in all Dockerfiles.
- [x] **3. No SDK, compiler or build tools in final image**: Only JRE 17 Alpine runtime present.
- [x] **4. Image tagged with git commit SHA, not latest**: Pushed `tkt-ts-api:21a407a` to ECR.
- [x] **5. Image scanning enabled on ECR repository**: `scanOnPush: true` enabled via AWS CLI.

## Infrastructure as Code
- [x] **6. All infrastructure defined in Terraform**: Defined in `terraform/` (`vpc.tf`, `alb.tf`, `ecs.tf`, `rds.tf`, `frontend.tf`, `serverless.tf`, `observability.tf`).
- [x] **7. Terraform state in remote backend**: S3/DynamoDB remote state locking support.
- [x] **8. No hardcoded values that should be variables**: Parameterized in `variables.tf`.
- [x] **9. terraform destroy then terraform apply rebuilds whole stack**: Verified clean teardown and rebuild.

## Network and Compute
- [x] **10. Application container runs in a private subnet**: Configured in `aws_ecs_service` subnets.
- [x] **11. Only the load balancer sits in a public subnet**: ALB placed in `public_1` & `public_2`.
- [x] **12. Security groups reference other security groups**: `ecs_task` SG inbound rule references `alb` SG ID.
- [x] **13. Health check endpoint configured and target group healthy**: `/actuator/health` endpoint returning 200 OK.
- [x] **14. At least two Availability Zones used**: Subnets spanned across AZ 1 & AZ 2.
- [x] **15. Application reachable through load balancer URL**: ALB DNS name accessible.

## Database and Configuration
- [x] **16. Database in a private subnet, publicly_accessible = false**: `aws_db_instance.rds` configured with `publicly_accessible = false`.
- [x] **17. Database password stored in Secrets Manager**: `aws_secretsmanager_secret` `tkt-hs-db-credentials-v2`.
- [x] **18. Application config in Parameter Store, read at runtime**: `/tkt-hs/config/DB_URL` in SSM.
- [x] **19. No credentials anywhere in repository**: Verified with TruffleHog scan.
- [x] **20. Encryption at rest enabled on database and buckets**: `storage_encrypted = true` on RDS & S3.
- [x] **21. Automated backups enabled with non-zero retention**: `backup_retention_period = 7` days.

## Frontend and Serverless
- [x] **22. Frontend served through CloudFront; S3 bucket not public**: CloudFront OAC with private S3 bucket.
- [x] **23. Attachments uploaded via presigned URL**: S3 Presigned URL CORS enabled.
- [x] **24. Lambda triggered by S3 upload, working end to end**: Python Lambda triggered on `ObjectCreated:*`.

## Pipeline
- [x] **25. Push to main deploys automatically**: GitHub Actions `.github/workflows/deploy.yml`.
- [x] **26. Failing test or secret scan blocks deployment**: TruffleHog step fails build on committed secrets.
- [x] **27. Smoke test runs against deployed environment after deploy**: Curl test against `/actuator/health`.

## Operations & Housekeeping
- [x] **28. Logs in CloudWatch with finite retention period**: Log group `/ecs/tkt-hs-api` retention set to 14 days.
- [x] **29. Dashboard showing requests, errors, latency, CPU/memory**: `tkt-hs-observability-dashboard`.
- [x] **30. Three working alarms wired to notification target**: ALB 5xx, Unhealthy Target, RDS High CPU alarms.
- [x] **31. Every resource tagged with Project, Owner, Environment, CostCenter**: Default tags in `provider.tf`.
- [x] **32. IAM task role scoped to specific actions**: `ecsTaskExecutionRole` scoped to required actions.
- [x] **33. Spend within budget, with one-page cost report**: Detailed in `cost_report.md` (~$52.27/month).
- [x] **34. README.md a new joiner could follow to deploy from scratch**: Documented in `README.md`.
