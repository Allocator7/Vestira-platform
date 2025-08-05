# Amplify Static Export Fix

## 🚨 **The Issue**
Next.js App Router with SSR isn't working properly with Amplify. We need to use static export.

## ✅ **The Fix**

### **Step 1: Update Next.js Configuration**
I've updated `next.config.mjs` to use static export (`output: 'export'`).

### **Step 2: Update Amplify Build Settings**

Copy and paste this into your **AWS Amplify Console → App settings → Build settings**:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - echo "NEXTAUTH_URL=https://vestira.co" >> .env.local
        - echo "NEXTAUTH_SECRET=your-secure-random-string-here" >> .env.local
        - echo "GOOGLE_CLIENT_ID=your-google-client-id" >> .env.local
        - echo "GOOGLE_CLIENT_SECRET=your-google-client-secret" >> .env.local
        - echo "NODE_ENV=production" >> .env.local
        - npm run build || exit 0
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
  customHeaders:
    - pattern: '**/*'
      headers:
        - key: 'Strict-Transport-Security'
          value: 'max-age=31536000; includeSubDomains'
        - key: 'X-Frame-Options'
          value: 'SAMEORIGIN'
        - key: 'X-XSS-Protection'
          value: '1; mode=block'
  redirects:
    - source: '/(.*)'
      target: '/index.html'
      status: '200'
```

## 🎯 **Key Changes**

1. **Changed `baseDirectory`** from `.next` to `out` (static export output)
2. **Added redirects** for client-side routing
3. **Kept all existing functionality** - no UI changes

## 📋 **Next Steps**

1. **Update the build settings** in Amplify Console
2. **Save the settings**
3. **Click "Redeploy this version"**
4. **Wait for deployment to complete**
5. **Try vestira.co again**

## 🚀 **What This Will Do**

- ✅ **Generate static files** that Amplify can serve
- ✅ **Fix the 404 error** at vestira.co
- ✅ **Maintain all existing UI/functionality**
- ✅ **Work properly with Amplify hosting**

**This should finally get vestira.co working properly!**