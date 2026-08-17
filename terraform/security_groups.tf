# 1. ALB Security Group (Public)
resource "aws_security_group" "alb" {
  name        = "${var.prefix}-alb-sg"
  description = "Security group for public Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow inbound HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.prefix}-alb-sg"
  }
}

# 2. ECS Task Security Group (Private - references ALB Security Group)
resource "aws_security_group" "ecs_task" {
  name        = "${var.prefix}-ecs-sg"
  description = "Security group for ECS Fargate task"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow inbound traffic ONLY from ALB security group"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "Allow all outbound traffic for pulling images and external API calls"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.prefix}-ecs-sg"
  }
}
