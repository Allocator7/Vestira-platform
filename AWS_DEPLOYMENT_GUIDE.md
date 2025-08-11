# AWS Deployment Guide for v0-Platform

This guide provides step-by-step instructions for deploying the v0-platform to AWS ECS.

## Prerequisites

1. **AWS CLI** installed and configured with appropriate permissions
2. **Docker** installed and running
3. **Node.js** and **npm** installed
4. AWS account with permissions for:
   - ECS (Elastic Container Service)
   - ECR (Elastic Container Registry)
   - IAM (Identity and Access Management)
   - Secrets Manager
   - CloudWatch Logs

## Phase 1: AWS Infrastructure Setup

### 1. Create ECR Repository

```bash
aws ecr create-repository \
    --repository-name v0-platform \
    --region us-east-1
```

### 2. Create ECS Cluster

```bash
aws ecs create-cluster \
    --cluster-name v0-platform-cluster \
    --region us-east-1
```

### 3. Create IAM Roles

#### Task Execution Role
```bash
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "ecs-tasks.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }'

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

#### Task Role
```bash
aws iam create-role \
    --role-name ecsTaskRole \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "ecs-tasks.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }'
```

### 4. Create CloudWatch Log Group

```bash
aws logs create-log-group \
    --log-group-name /ecs/v0-platform \
    --region us-east-1
```

### 5. Store Secrets in AWS Secrets Manager

```bash
# Store Google OAuth credentials
aws secretsmanager create-secret \
    --name google-client-id \
    --description "Google OAuth Client ID" \
    --secret-string "your-google-client-id" \
    --region us-east-1

aws secretsmanager create-secret \
    --name google-client-secret \
    --description "Google OAuth Client Secret" \
    --secret-string "your-google-client-secret" \
    --region us-east-1
```

## Phase 2: Application Deployment

### 1. Update Configuration Files

1. **Update `aws/task-definition.json`**:
   - Replace `ACCOUNT_ID` with your AWS account ID
   - Replace `REGION` with your AWS region
   - Update the `NEXTAUTH_URL` with your domain

2. **Set Environment Variables**:
   ```bash
   export AWS_REGION=us-east-1
   export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
   ```

### 2. Build and Deploy

```bash
# Make the deployment script executable
chmod +x scripts/deploy-aws.sh

# Run the deployment
./scripts/deploy-aws.sh
```

### 3. Create ECS Service

```bash
aws ecs create-service \
    --cluster v0-platform-cluster \
    --service-name v0-platform-service \
    --task-definition v0-platform:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678],securityGroups=[sg-12345678],assignPublicIp=ENABLED}" \
    --region us-east-1
```

## Phase 3: Load Balancer Setup (Optional)

### 1. Create Application Load Balancer

```bash
aws elbv2 create-load-balancer \
    --name v0-platform-alb \
    --subnets subnet-12345678 subnet-87654321 \
    --security-groups sg-12345678 \
    --region us-east-1
```

### 2. Create Target Group

```bash
aws elbv2 create-target-group \
    --name v0-platform-tg \
    --protocol HTTP \
    --port 3000 \
    --vpc-id vpc-12345678 \
    --target-type ip \
    --region us-east-1
```

### 3. Create Listener

```bash
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:loadbalancer/app/v0-platform-alb/1234567890abcdef \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/v0-platform-tg/1234567890abcdef \
    --region us-east-1
```

## Phase 4: Monitoring and Logging

### 1. Set up CloudWatch Alarms

```bash
# Create CPU utilization alarm
aws cloudwatch put-metric-alarm \
    --alarm-name v0-platform-cpu-high \
    --alarm-description "CPU utilization is high" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2 \
    --region us-east-1
```

### 2. Set up Log Retention

```bash
aws logs put-retention-policy \
    --log-group-name /ecs/v0-platform \
    --retention-in-days 30 \
    --region us-east-1
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Check that all dependencies are properly installed
2. **ECR Push Errors**: Ensure you're logged into ECR
3. **ECS Service Errors**: Check the task definition and IAM roles
4. **Health Check Failures**: Verify the health check endpoint is working

### Useful Commands

```bash
# Check ECS service status
aws ecs describe-services \
    --cluster v0-platform-cluster \
    --services v0-platform-service \
    --region us-east-1

# View logs
aws logs describe-log-streams \
    --log-group-name /ecs/v0-platform \
    --region us-east-1

# Update service
aws ecs update-service \
    --cluster v0-platform-cluster \
    --service v0-platform-service \
    --force-new-deployment \
    --region us-east-1
```

## Security Considerations

1. **Secrets Management**: All sensitive data is stored in AWS Secrets Manager
2. **Network Security**: Use private subnets and security groups
3. **IAM Roles**: Follow the principle of least privilege
4. **Logging**: All application logs are sent to CloudWatch
5. **Health Checks**: Regular health checks ensure service availability

## Cost Optimization

1. **Use Fargate Spot** for non-production workloads
2. **Right-size** CPU and memory allocations
3. **Set up auto-scaling** based on demand
4. **Monitor costs** with AWS Cost Explorer

## Next Steps

After successful deployment:

1. Set up a custom domain with Route 53
2. Configure SSL/TLS certificates with AWS Certificate Manager
3. Set up CI/CD pipeline with AWS CodePipeline
4. Implement auto-scaling policies
5. Set up monitoring and alerting

## Support

For issues with this deployment:

1. Check the AWS ECS console for service status
2. Review CloudWatch logs for application errors
3. Verify IAM permissions and roles
4. Test the health check endpoint manually