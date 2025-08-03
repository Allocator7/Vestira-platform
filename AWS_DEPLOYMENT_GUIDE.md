# AWS Deployment Guide

This guide will walk you through deploying your Next.js application to AWS using the Serverless Framework.

## Architecture Overview

The application is deployed using the following AWS services:

- **AWS Lambda**: Hosts the Next.js application as serverless functions
- **API Gateway**: Handles HTTP requests and routes them to Lambda
- **CloudFront**: CDN for global content delivery and caching
- **S3**: Stores static assets (images, CSS, JS files)
- **Systems Manager Parameter Store**: Securely stores environment variables
- **CloudFormation**: Infrastructure as Code for resource management

## Prerequisites

### 1. Install Required Tools

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install Serverless Framework globally
npm install -g serverless

# Verify installations
aws --version
serverless --version
```

### 2. Configure AWS Credentials

```bash
# Configure AWS CLI with your credentials
aws configure

# Or use environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

### 3. Set Up IAM Permissions

Your AWS user/role needs the following permissions:
- CloudFormation (full access)
- Lambda (full access)
- API Gateway (full access)
- S3 (full access)
- CloudFront (full access)
- IAM (limited for role creation)
- Systems Manager Parameter Store (full access)

## Deployment Steps

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd my-v0-project

# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

Run the environment setup script:

```bash
# Make the script executable
chmod +x scripts/setup-aws-env.sh

# Run the script for development stage
./scripts/setup-aws-env.sh dev us-east-1

# Run the script for production stage
./scripts/setup-aws-env.sh prod us-east-1
```

The script will prompt you for:
- `NEXTAUTH_SECRET` (or generate one automatically)
- `GOOGLE_CLIENT_ID` 
- `GOOGLE_CLIENT_SECRET`
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`

### Step 3: Update Domain Configuration

Edit `serverless.yml` and update the `custom.domainName` field:

```yaml
custom:
  domainName: your-actual-domain.com  # Update this
```

### Step 4: Deploy the Infrastructure

```bash
# Deploy to development stage
npm run deploy:aws

# Or deploy to production stage
npm run deploy:aws:prod
```

This will create:
- Lambda functions for your Next.js app
- API Gateway endpoints
- CloudFront distribution
- S3 bucket for static assets
- All necessary IAM roles and policies

### Step 5: Deploy Static Assets

```bash
# Deploy static assets to development
npm run deploy:static

# Deploy static assets to production
npm run deploy:static:prod
```

This will:
- Build your Next.js application
- Upload static files to S3
- Invalidate CloudFront cache

### Step 6: Get Your Application URL

After deployment, you'll see output similar to:

```
CloudFront Distribution: d1234567890abc.cloudfront.net
S3 Bucket: my-v0-project-dev-static-assets
```

Your application will be available at the CloudFront URL.

## OAuth Provider Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add your CloudFront domain to authorized domains:
   - `https://your-cloudfront-url.cloudfront.net`
6. Add redirect URI:
   - `https://your-cloudfront-url.cloudfront.net/api/auth/callback/google`

### Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Create a new registration
4. Add redirect URI:
   - `https://your-cloudfront-url.cloudfront.net/api/auth/callback/microsoft`
5. Get the Application (client) ID and create a client secret

## Environment Management

### Viewing Environment Variables

```bash
# List all parameters for a stage
aws ssm get-parameters-by-path \
  --path "/my-v0-project/dev/" \
  --recursive \
  --with-decryption

# Get a specific parameter
aws ssm get-parameter \
  --name "/my-v0-project/dev/nextauth-secret" \
  --with-decryption
```

### Updating Environment Variables

```bash
# Update a parameter
aws ssm put-parameter \
  --name "/my-v0-project/dev/nextauth-secret" \
  --value "new-secret-value" \
  --type "SecureString" \
  --overwrite
```

## Monitoring and Logs

### CloudWatch Logs

```bash
# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/my-v0-project"

# Tail logs in real-time
serverless logs -f nextjs -t
```

### CloudWatch Metrics

Monitor your application through the AWS Console:
- Lambda function metrics (invocations, duration, errors)
- API Gateway metrics (requests, latency, errors)
- CloudFront metrics (cache hit ratio, origin requests)

## Scaling and Performance

### Lambda Configuration

Adjust in `serverless.yml`:

```yaml
functions:
  nextjs:
    handler: index.handler
    timeout: 30          # Increase for longer operations
    memorySize: 1024     # Increase for better performance
    reservedConcurrency: 50  # Limit concurrent executions
```

### CloudFront Caching

The configuration includes optimized caching:
- Static assets: 1 year cache
- API responses: No cache (dynamic content)
- Public assets: 1 day cache

## Cost Optimization

### Lambda Pricing

- Pay per request and compute time
- First 1M requests per month are free
- ~$0.20 per 1M requests after free tier

### CloudFront Pricing

- Pay per request and data transfer
- First 1TB transfer per month free
- ~$0.085 per GB after free tier

### S3 Pricing

- Pay for storage and requests
- First 5GB storage free
- ~$0.023 per GB after free tier

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Check IAM permissions
   - Ensure AWS CLI is configured correctly

2. **"Module not found" errors in Lambda**
   - Check if all dependencies are in `package.json`
   - Verify the build process includes all required files

3. **OAuth callback errors**
   - Verify redirect URLs in OAuth provider settings
   - Check that NEXTAUTH_URL matches your CloudFront domain

4. **Static assets not loading**
   - Verify S3 bucket permissions
   - Check CloudFront distribution settings
   - Run `npm run deploy:static` to update assets

### Debug Commands

```bash
# Check deployment status
serverless info

# View stack outputs
aws cloudformation describe-stacks --stack-name my-v0-project-dev

# Test Lambda function locally
serverless invoke local -f nextjs

# Remove deployment if needed
npm run remove:aws
```

## Custom Domain Setup (Optional)

### 1. Request SSL Certificate

```bash
# Request a certificate in us-east-1 (required for CloudFront)
aws acm request-certificate \
  --domain-name your-domain.com \
  --subject-alternative-names www.your-domain.com \
  --validation-method DNS \
  --region us-east-1
```

### 2. Update serverless.yml

```yaml
custom:
  domainName: your-domain.com
  certificateArn: arn:aws:acm:us-east-1:123456789:certificate/your-cert-id

resources:
  Resources:
    CloudFrontDistribution:
      Properties:
        DistributionConfig:
          Aliases:
            - ${self:custom.domainName}
          ViewerCertificate:
            AcmCertificateArn: ${self:custom.certificateArn}
            SslSupportMethod: sni-only
```

### 3. Update DNS

Point your domain's CNAME to the CloudFront distribution domain.

## Security Best Practices

1. **Environment Variables**: Always use AWS Systems Manager Parameter Store for sensitive data
2. **IAM Permissions**: Use least privilege principle
3. **HTTPS Only**: All traffic is redirected to HTTPS
4. **CORS**: Configure appropriate CORS settings
5. **Rate Limiting**: Consider implementing rate limiting for API endpoints

## Backup and Disaster Recovery

1. **Infrastructure**: All infrastructure is defined in code (`serverless.yml`)
2. **Environment Variables**: Regularly backup SSM parameters
3. **Static Assets**: S3 has built-in versioning capabilities
4. **Database**: If using a database, implement regular backups

## Production Checklist

- [ ] Environment variables configured in Parameter Store
- [ ] OAuth providers configured with production URLs
- [ ] Custom domain configured (optional)
- [ ] SSL certificate installed
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security review completed

## Support

For issues and questions:
1. Check AWS CloudWatch logs
2. Review this deployment guide
3. Check the main README.md for general application information
4. Contact your development team