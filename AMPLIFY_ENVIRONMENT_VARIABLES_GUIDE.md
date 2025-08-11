# Finding Environment Variables in AWS Amplify Console

## 🔍 Where to Find Environment Variables

### Method 1: App Settings (Most Common)
1. Go to **AWS Amplify Console**
2. Select your app
3. Click on **"App settings"** (usually in the left sidebar)
4. Look for **"Environment variables"** or **"Build settings"**
5. Click on **"Environment variables"**

### Method 2: Build Settings
1. Go to **AWS Amplify Console**
2. Select your app
3. Click on **"App settings"**
4. Click on **"Build settings"**
5. Look for **"Environment variables"** section

### Method 3: Branch Settings
1. Go to **AWS Amplify Console**
2. Select your app
3. Click on your branch name (usually "main" or "master")
4. Look for **"Environment variables"** in branch settings

### Method 4: Build Configuration
1. Go to **AWS Amplify Console**
2. Select your app
3. Click on **"App settings"**
4. Click on **"Build settings"**
5. Look for **"Environment variables"** in the build configuration

## 🚨 If You Still Can't Find It

### Alternative: Use amplify.yml
If you can't find the environment variables section, we can add them directly to the `amplify.yml` file:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - echo "NEXTAUTH_URL=$NEXTAUTH_URL" >> .env.local
        - echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.local
        - echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env.local
        - echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env.local
        - echo "NODE_ENV=production" >> .env.local
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## 📱 Current Amplify Console Layout

The Amplify console interface has changed over time. The environment variables might be located in:

- **App settings** → **Environment variables**
- **App settings** → **Build settings** → **Environment variables**
- **Branch settings** → **Environment variables**
- **Build configuration** → **Environment variables**

## 🔍 What to Look For

Look for these terms in the Amplify console:
- "Environment variables"
- "Build environment variables"
- "App environment variables"
- "Build settings"

## 📞 If You Still Can't Find It

1. **Check the Amplify documentation** for the current interface
2. **Look for "Build settings"** - environment variables are often there
3. **Check branch-specific settings** - variables might be per-branch
4. **Use the amplify.yml method** above as a fallback

## 🎯 Next Steps

1. Try the methods above to find environment variables
2. If you find them, add the required variables
3. If you can't find them, we'll use the amplify.yml method
4. Then redeploy

Let me know what you see in your Amplify console and I'll help you locate the right section!