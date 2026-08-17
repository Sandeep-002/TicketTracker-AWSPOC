# 1. Attachments S3 Bucket
resource "aws_s3_bucket" "attachments" {
  bucket        = "${var.prefix}-attachments-${data.aws_caller_identity.current.account_id}"
  force_destroy = true

  tags = {
    Name = "${var.prefix}-attachments-bucket"
  }
}

# Block public access to Attachments Bucket
resource "aws_s3_bucket_public_access_block" "attachments_block" {
  bucket                  = aws_s3_bucket.attachments.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CORS configuration for presigned URL uploads directly from browser
resource "aws_s3_bucket_cors_configuration" "attachments_cors" {
  bucket = aws_s3_bucket.attachments.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# 2. IAM Role for Lambda Function
resource "aws_iam_role" "lambda_role" {
  name = "${var.prefix}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for Lambda (S3 Read/Write & CloudWatch Logs)
resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.prefix}-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/${var.prefix}-*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.attachments.arn,
          "${aws_s3_bucket.attachments.arn}/*"
        ]
      }
    ]
  })
}

# 3. Zip Lambda Source Code
data "archive_file" "lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/lambda_thumbnail.zip"

  source {
    content  = <<EOF
import json
import urllib.parse
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    for record in event.get('Records', []):
        bucket = record['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(record['s3']['object']['key'], encoding='utf-8')
        
        # Skip if already a thumbnail
        if key.startswith('thumbnails/'):
            continue
            
        print(f"File uploaded to {bucket}: {key}")
        thumbnail_key = f"thumbnails/thumb_{key.split('/')[-1]}"
        
        # Write thumbnail marker file back to S3
        s3.put_object(
            Bucket=bucket,
            Key=thumbnail_key,
            Body=f"Thumbnail marker generated for {key}".encode('utf-8'),
            ContentType='text/plain'
        )
        print(f"Generated thumbnail: {thumbnail_key}")
        
    return {
        'statusCode': 200,
        'body': json.dumps('Thumbnail generated successfully!')
    }
EOF
    filename = "index.py"
  }
}

# 4. Lambda Function
resource "aws_lambda_function" "thumbnail_generator" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${var.prefix}-thumbnail-generator"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.lambda_handler"
  runtime          = "python3.11"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  tags = {
    Name = "${var.prefix}-thumbnail-generator"
  }
}

# 5. Permission for S3 to invoke Lambda
resource "aws_lambda_permission" "allow_s3_invoke" {
  statement_id  = "AllowExecutionFromS3"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.thumbnail_generator.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.attachments.arn
}

# 6. S3 Event Notification to Trigger Lambda on File Upload
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.attachments.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.thumbnail_generator.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
  }

  depends_on = [aws_lambda_permission.allow_s3_invoke]
}
