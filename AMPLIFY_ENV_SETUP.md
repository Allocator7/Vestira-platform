# AWS Amplify Environment Variables Setup

## 🚨 Current Situation
You're using AWS Amplify but environment variables aren't visible in the console. Here's how to handle this:

## ✅ Solution: Environment Variables in Build Process

I've updated your `amplify.yml` to create environment variables during the build process. However, you need to replace the placeholder values with your actual credentials.

## 🔧 Steps to Fix

### Step 1: Update amplify.yml with Your Real Values

In your `amplify.yml` file, replace these placeholder values:

```yaml
- echo "NEXTAUTH_URL=https://$AWS_APP_ID.amplifyapp.com" >> .env.local
- echo "NEXTAUTH_SECRET=your-secure-random-string-here" >> .env.local
- echo "GOOGLE_CLIENT_ID=your-google-client-id" >> .env.local
- echo "GOOGLE_CLIENT_SECRET=your-google-client-secret" >> .env.local
```

With your actual values:

```yaml
- echo "NEXTAUTH_URL=https://your-actual-amplify-domain.amplifyapp.com" >> .env.local
- echo "NEXTAUTH_SECRET=your-actual-secret-key" >> .env.local
- echo "GOOGLE_CLIENT_ID=your-actual-google-client-id" >> .env.local
- echo "GOOGLE_CLIENT_SECRET=your-actual-google-client-secret" >> .env.local
```

### Step 2: Get Your Values

#### For NEXTAUTH_URL:
- Use your actual Amplify domain (e.g., `https://d1234567890.amplifyapp.com`)

#### For NEXTAUTH_SECRET:
- Generate a random string (you can use an online generator)
- Example: `my-super-secret-key-123456789`

#### For Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Get the Client ID and Client Secret
4. Add your Amplify domain to authorized redirect URIs

### Step 3: Alternative Method (Recommended)

Instead of hardcoding in amplify.yml, you can set these in the Amplify console:

1. Go to **App settings** → **Build settings**
2. Look for **"Environment variables"** section (might be hidden)
3. If you find it, add the variables there
4. If not, use the amplify.yml method above

## 🚀 Then Redeploy

After updating the values, click **"Redeploy this version"** in Amplify Console.

## 🔍 What to Expect

- **Build should succeed** with proper environment variables
- **Authentication should work** with Google OAuth
- **App should function normally** with all existing UI/functionality

## 📞 If You Need Help

1. **Don't have Google OAuth credentials?** - I can help you set those up
2. **Don't know your Amplify domain?** - Check the URL when your app is deployed
3. **Need help generating a secret?** - I can provide a secure random string

Let me know what values you need help with!