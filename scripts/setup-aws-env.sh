#!/bin/bash

# AWS Environment Setup Script for my-v0-project
# This script creates the necessary environment variables in AWS Systems Manager Parameter Store

set -e

# Default values
STAGE=${1:-dev}
REGION=${2:-us-east-1}

echo "Setting up environment variables for stage: $STAGE in region: $REGION"

# Function to create SSM parameter
create_parameter() {
    local name=$1
    local value=$2
    local description=$3
    
    echo "Creating parameter: $name"
    aws ssm put-parameter \
        --region $REGION \
        --name "/my-v0-project/$STAGE/$name" \
        --value "$value" \
        --type "SecureString" \
        --description "$description" \
        --overwrite 2>/dev/null || echo "Parameter $name already exists or failed to create"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Please configure your AWS credentials first using 'aws configure' or environment variables."
    exit 1
fi

echo "Please provide the following environment variables:"

# NextAuth Secret
echo ""
read -s -p "Enter NEXTAUTH_SECRET (press Enter to generate a random one): " NEXTAUTH_SECRET
echo ""
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "Generated random NEXTAUTH_SECRET"
fi

# Google OAuth credentials
echo ""
read -p "Enter GOOGLE_CLIENT_ID: " GOOGLE_CLIENT_ID
read -s -p "Enter GOOGLE_CLIENT_SECRET: " GOOGLE_CLIENT_SECRET
echo ""

# Microsoft OAuth credentials
echo ""
read -p "Enter MICROSOFT_CLIENT_ID: " MICROSOFT_CLIENT_ID
read -s -p "Enter MICROSOFT_CLIENT_SECRET: " MICROSOFT_CLIENT_SECRET
echo ""

# Create parameters in AWS SSM
echo ""
echo "Creating parameters in AWS Systems Manager Parameter Store..."

create_parameter "nextauth-secret" "$NEXTAUTH_SECRET" "NextAuth.js secret for JWT encryption"
create_parameter "google-client-id" "$GOOGLE_CLIENT_ID" "Google OAuth client ID"
create_parameter "google-client-secret" "$GOOGLE_CLIENT_SECRET" "Google OAuth client secret"
create_parameter "microsoft-client-id" "$MICROSOFT_CLIENT_ID" "Microsoft OAuth client ID"
create_parameter "microsoft-client-secret" "$MICROSOFT_CLIENT_SECRET" "Microsoft OAuth client secret"

echo ""
echo "✅ Environment variables have been set up in AWS Systems Manager Parameter Store"
echo "✅ Stage: $STAGE"
echo "✅ Region: $REGION"
echo ""
echo "You can now deploy your application using:"
echo "npm run deploy:aws -- --stage $STAGE --region $REGION"