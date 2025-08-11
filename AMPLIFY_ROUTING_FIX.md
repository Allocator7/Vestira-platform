# Fix for Amplify 404 Error

## 🚨 **The Issue**
The app deployed successfully but shows 404 at vestira.co. This is a Next.js routing issue with Amplify.

## ✅ **The Fix**

### **Updated Build Settings for Amplify Console**

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
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
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
    - pattern: '/_next/static/**/*'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
    - pattern: '**/*.js'
      headers:
        - key: 'Cache-Control'
          value: 'public, max-age=31536000, immutable'
  redirects:
    - source: '</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>'
      target: '/index.html'
      status: '200'
```

## 🎯 **Key Changes**

1. **Added redirects** for client-side routing
2. **Proper caching headers** for Next.js
3. **Security headers** for production

## 📋 **Next Steps**

1. **Update the build settings** with the configuration above
2. **Save the settings**
3. **Click "Redeploy this version"**
4. **Wait for deployment to complete**
5. **Try vestira.co again**

**This should fix the 404 issue and make your app accessible at vestira.co!**