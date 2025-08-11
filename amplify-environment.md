# AWS Amplify Environment Variables

## Required Environment Variables

Set these in your AWS Amplify Console under **App settings > Environment variables**:

### Authentication
```
NEXTAUTH_URL=https://your-amplify-domain.amplifyapp.com
NEXTAUTH_SECRET=your-nextauth-secret-key-here
```

### Google OAuth (Required)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Application Settings
```
NODE_ENV=production
```

## How to Set Environment Variables in Amplify

1. Go to AWS Amplify Console
2. Select your app
3. Go to **App settings** > **Environment variables**
4. Add each variable with its value
5. Save and redeploy

## Important Notes

- **NEXTAUTH_URL**: Must match your Amplify domain exactly
- **NEXTAUTH_SECRET**: Generate a strong random string
- **Google OAuth**: Configure in Google Cloud Console and add credentials here

## Troubleshooting

If deployment fails:
1. Check that all environment variables are set
2. Verify NEXTAUTH_URL matches your domain
3. Ensure Google OAuth credentials are correct
4. Check build logs in Amplify Console