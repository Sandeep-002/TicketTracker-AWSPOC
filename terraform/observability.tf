# 1. SNS Topic for Alarm Notifications
resource "aws_sns_topic" "alarm_notifications" {
  name = "${var.prefix}-alarm-topic"

  tags = {
    Name = "${var.prefix}-alarm-topic"
  }
}

# 2. Alarm 1: HTTP 5xx Error Rate Alarm (ALB)
resource "aws_cloudwatch_metric_alarm" "alb_5xx_alarm" {
  alarm_name          = "${var.prefix}-high-5xx-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Alarm triggers if 5xx errors exceed 5 in a minute"
  alarm_actions       = [aws_sns_topic.alarm_notifications.arn]

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }
}

# 3. Alarm 2: Unhealthy Host Count Alarm (Target Group)
resource "aws_cloudwatch_metric_alarm" "unhealthy_target_alarm" {
  alarm_name          = "${var.prefix}-unhealthy-target-count"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Alarm triggers if any target group host becomes unhealthy"
  alarm_actions       = [aws_sns_topic.alarm_notifications.arn]

  dimensions = {
    TargetGroup  = aws_lb_target_group.api.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }
}

# 4. Alarm 3: High Database CPU Alarm (RDS)
resource "aws_cloudwatch_metric_alarm" "rds_high_cpu" {
  alarm_name          = "${var.prefix}-rds-high-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Alarm triggers if RDS CPU utilization exceeds 80%"
  alarm_actions       = [aws_sns_topic.alarm_notifications.arn]

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.rds.identifier
  }
}

# 5. CloudWatch Observability Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.prefix}-observability-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.main.arn_suffix],
            [".", "HTTPCode_Target_5XX_Count", ".", "."]
          ]
          period = 60
          stat   = "Sum"
          region = var.aws_region
          title  = "ALB Requests & 5xx Error Rate"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", aws_lb.main.arn_suffix]
          ]
          period = 60
          stat   = "Average"
          region = var.aws_region
          title  = "API Response Time (Latency)"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", aws_ecs_service.api.name, "ClusterName", aws_ecs_cluster.main.name],
            [".", "MemoryUtilization", ".", ".", ".", "."]
          ]
          period = 60
          stat   = "Average"
          region = var.aws_region
          title  = "ECS Container CPU & Memory Utilization"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.rds.identifier],
            [".", "DatabaseConnections", ".", "."]
          ]
          period = 60
          stat   = "Average"
          region = var.aws_region
          title  = "RDS Database Connections & CPU Utilization"
        }
      }
    ]
  })
}
