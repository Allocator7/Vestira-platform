# AWS Amplify Deployment Guide

## ✅ What's Been Fixed for Amplify Deployment

### 1. **Amplify Build Configuration**
- ✅ Created `amplify.yml` - Proper build specification for Amplify
- ✅ Fixed Next.js configuration for Amplify (removed ECS-specific settings)
- ✅ Added security headers for production deployment

### 2. **Environment Variables Setup**
- ✅ Documented required environment variables
- ✅ Provided step-by-step setup instructions
- ✅ Included troubleshooting guide

## 🔧 Configuration Changes Made (No UI/Functionality Impact)

### Next.js Configuration (amplify-optimized)
```javascript
// Removed ECS-specific settings
// Added Amplify-compatible configuration
output: undefined, // Standard Next.js output for Amplify
```

### Amplify Build Specification
```yaml
# Proper build phases for Amplify
# Security headers for production
# Optimized caching strategy
```

## 🚀 Step-by-Step Amplify Deployment

### Step 1: Set Environment Variables in Amplify Console

1. Go to **AWS Amplify Console**
2. Select your app
3. Go to **App settings** > **Environment variables**
4. Add these variables:

```
NEXTAUTH_URL=https://your-amplify-domain.amplifyapp.com
NEXTAUTH_SECRET=your-secure-random-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=production
```

### Step 2: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add your Amplify domain to authorized redirect URIs:
   - `https://your-amplify-domain.amplifyapp.com/api/auth/callback/google`

### Step 3: Redeploy

1. In Amplify Console, click **Redeploy this version**
2. Monitor the build logs
3. Check for any environment variable errors

## 🔍 Troubleshooting Common Amplify Issues

### Build Failures
- **Issue**: Missing environment variables
- **Solution**: Add all required variables in Amplify Console

### Authentication Errors
- **Issue**: NEXTAUTH_URL mismatch
- **Solution**: Ensure URL matches your Amplify domain exactly

### Google OAuth Issues
- **Issue**: Redirect URI not authorized
- **Solution**: Add Amplify domain to Google OAuth settings

### SSR Errors
- **Issue**: localStorage/undefined errors during build
- **Solution**: These are expected during build and won't affect runtime

## 📋 Files Created for Amplify

### New Files
- `amplify.yml` - Build specification
- `amplify-environment.md` - Environment variables guide
- `AMPLIFY_DEPLOYMENT_GUIDE.md` - This guide

### Modified Files
- `next.config.mjs` - Optimized for Amplify (removed ECS settings)

## 🎯 Next Steps

1. **Set Environment Variables** in Amplify Console
2. **Configure Google OAuth** with your Amplify domain
3. **Redeploy** using Amplify Console
4. **Monitor** build logs for any issues

## ✅ What's Ready

- ✅ Amplify build configuration
- ✅ Environment variables documentation
- ✅ Security headers configured
- ✅ Zero UI/functionality changes
- ✅ Proper Next.js settings for Amplify

## 🚨 Important Notes

- **No UI Changes**: All existing functionality preserved
- **No Code Changes**: Only deployment configuration modified
- **Environment Variables**: Must be set in Amplify Console
- **Google OAuth**: Must be configured with Amplify domain

## 📞 Support

If deployment still fails:
1. Check Amplify build logs
2. Verify all environment variables are set
3. Ensure Google OAuth is properly configured
4. Confirm NEXTAUTH_URL matches your domain exactly