#!/bin/bash

# Static Assets Deployment Script for AWS
# This script handles uploading static assets to S3 and invalidating CloudFront cache

set -e

# Default values
STAGE=${1:-dev}
REGION=${2:-us-east-1}
SERVICE_NAME="my-v0-project"

echo "Deploying static assets for stage: $STAGE in region: $REGION"

# Get stack outputs
S3_BUCKET=$(aws cloudformation describe-stacks \
    --region $REGION \
    --stack-name "$SERVICE_NAME-$STAGE" \
    --query "Stacks[0].Outputs[?OutputKey=='S3BucketName'].OutputValue" \
    --output text 2>/dev/null || echo "")

CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --region $REGION \
    --stack-name "$SERVICE_NAME-$STAGE" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
    --output text 2>/dev/null || echo "")

if [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "❌ Could not find S3 bucket or CloudFront distribution. Make sure the stack is deployed first."
    echo "Run: npm run deploy:aws -- --stage $STAGE --region $REGION"
    exit 1
fi

echo "📦 S3 Bucket: $S3_BUCKET"
echo "🌐 CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION_ID"

# Build the application
echo ""
echo "🏗️  Building application..."
npm run build

# Upload static assets to S3
echo ""
echo "📤 Uploading static assets to S3..."

# Upload _next/static files
if [ -d ".next/static" ]; then
    aws s3 sync .next/static/ s3://$S3_BUCKET/_next/static/ \
        --region $REGION \
        --cache-control "public, max-age=31536000, immutable" \
        --delete
    echo "✅ Uploaded _next/static files"
fi

# Upload public static files
if [ -d "public" ]; then
    aws s3 sync public/ s3://$S3_BUCKET/static/ \
        --region $REGION \
        --cache-control "public, max-age=86400" \
        --delete
    echo "✅ Uploaded public static files"
fi

# Create CloudFront invalidation
echo ""
echo "🔄 Creating CloudFront invalidation..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/_next/static/*" "/static/*" \
    --query "Invalidation.Id" \
    --output text)

echo "✅ CloudFront invalidation created: $INVALIDATION_ID"

# Wait for invalidation to complete (optional)
read -p "Wait for invalidation to complete? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⏳ Waiting for invalidation to complete..."
    aws cloudfront wait invalidation-completed \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --id $INVALIDATION_ID
    echo "✅ CloudFront invalidation completed"
fi

echo ""
echo "🎉 Static assets deployment completed successfully!"
echo "📊 S3 Bucket: $S3_BUCKET"
echo "🌐 CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION_ID"