# 1. IAM Task Execution Role
resource "aws_iam_role" "ecs_execution_role" {
  name = "${var.prefix}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_secrets_policy" {
  name = "${var.prefix}-ecs-secrets-policy"
  role = aws_iam_role.ecs_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          aws_secretsmanager_secret.db_secret.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter"
        ]
        Resource = [
          "arn:aws:ssm:${var.aws_region}:*:parameter/${var.prefix}/*"
        ]
      }
    ]
  })
}

# 2. ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.prefix}-cluster"
}

# 3. ECS Task Definition
resource "aws_ecs_task_definition" "api" {
  family                   = "${var.prefix}-taskdef"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "api-container"
      image     = var.container_image
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.prefix}-api"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
          "awslogs-create-group"  = "true"
        }
      }
    },
    {
      name      = "auth-container"
      image     = var.auth_image
      essential = true
      portMappings = [
        {
          containerPort = 8081
          hostPort      = 8081
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "DB_HOST", value = aws_db_instance.rds.address },
        { name = "SPRING_DATASOURCE_USERNAME", value = aws_ssm_parameter.db_user.value },
        { name = "SPRING_DATASOURCE_PASSWORD", value = random_password.db_password.result }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.prefix}-api"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs-auth"
          "awslogs-create-group"  = "true"
        }
      }
    },
    {
      name      = "ticket-container"
      image     = var.ticket_image
      essential = true
      portMappings = [
        {
          containerPort = 8082
          hostPort      = 8082
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "DB_HOST", value = aws_db_instance.rds.address },
        { name = "SPRING_DATASOURCE_USERNAME", value = aws_ssm_parameter.db_user.value },
        { name = "SPRING_DATASOURCE_PASSWORD", value = random_password.db_password.result },
        { name = "KAFKA_BOOTSTRAP_SERVERS", value = "127.0.0.1:9092" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.prefix}-api"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs-ticket"
          "awslogs-create-group"  = "true"
        }
      }
    },
    {
      name      = "notification-container"
      image     = var.notification_image
      essential = true
      portMappings = [
        {
          containerPort = 8083
          hostPort      = 8083
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "KAFKA_BOOTSTRAP_SERVERS", value = "127.0.0.1:9092" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.prefix}-api"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs-notification"
          "awslogs-create-group"  = "true"
        }
      }
    },
    {
      name      = "kafka-container"
      image     = "bashj79/kafka-kraft:latest"
      essential = true
      portMappings = [
        {
          containerPort = 9092
          hostPort      = 9092
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.prefix}-api"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs-kafka"
          "awslogs-create-group"  = "true"
        }
      }
    }
  ])
}

# CloudWatch Log Group for ECS Task Logs
resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.prefix}-api"
  retention_in_days = 14
}

# 4. ECS Service
resource "aws_ecs_service" "api" {
  name            = "${var.prefix}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    security_groups  = [aws_security_group.ecs_task.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api-container"
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.http]
}
