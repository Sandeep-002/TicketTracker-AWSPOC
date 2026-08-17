# 1. Random Password for Database
resource "random_password" "db_password" {
  length  = 16
  special = false
}

# 2. Secrets Manager Secret for DB Password
resource "aws_secretsmanager_secret" "db_secret" {
  name                    = "${var.prefix}-db-credentials-v2"
  recovery_window_in_days = 0

  tags = {
    Name = "${var.prefix}-db-secret"
  }
}

resource "aws_secretsmanager_secret_version" "db_secret_ver" {
  secret_id = aws_secretsmanager_secret.db_secret.id
  secret_string = jsonencode({
    username = "admin"
    password = random_password.db_password.result
    engine   = "mysql"
    host     = aws_db_instance.rds.address
    port     = 3306
    dbname   = "ticketdesk_db"
  })
}

# 3. Parameter Store (SSM) Application Config
resource "aws_ssm_parameter" "db_url" {
  name  = "/${var.prefix}/config/DB_URL"
  type  = "String"
  value = "jdbc:mysql://${aws_db_instance.rds.endpoint}/ticketdesk_db?createDatabaseIfNotExist=true&useSSL=false"
}

resource "aws_ssm_parameter" "db_user" {
  name  = "/${var.prefix}/config/DB_USER"
  type  = "String"
  value = "admin"
}

# 4. Security Group for RDS MySQL
resource "aws_security_group" "rds" {
  name        = "${var.prefix}-rds-sg"
  description = "Security group for private RDS MySQL database"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow MySQL access ONLY from ECS tasks"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_task.id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.prefix}-rds-sg"
  }
}

# 5. DB Subnet Group (Private Subnets)
resource "aws_db_subnet_group" "private" {
  name       = "${var.prefix}-db-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "${var.prefix}-db-subnet-group"
  }
}

# 6. RDS MySQL Instance (Private, Not Publicly Accessible)
resource "aws_db_instance" "rds" {
  identifier             = "${var.prefix}-mysql"
  allocated_storage      = 20
  max_allocated_storage  = 50
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  db_name                = "ticketdesk_db"
  username               = "admin"
  password               = random_password.db_password.result
  db_subnet_group_name   = aws_db_subnet_group.private.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  skip_final_snapshot    = true
  storage_encrypted      = true
  backup_retention_period = 1

  tags = {
    Name = "${var.prefix}-mysql"
  }
}
