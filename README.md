# Platform

A modern Next.js application with authentication and role-based access control.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Deployed on AWS](https://img.shields.io/badge/Deployed%20on-AWS-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)

## Overview

This is a full-stack Next.js application featuring:
- 🔐 Authentication with NextAuth.js (Google & Microsoft OAuth)
- 👥 Role-based access control (Manager, Allocator, Consultant)
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 📊 Interactive charts and data visualization
- 🚀 Serverless deployment on AWS

## Features

- **Authentication**: Secure login with Google and Microsoft OAuth providers
- **Role Management**: Different interfaces for Managers, Allocators, and Consultants
- **Resource Allocation**: Tools for managing and tracking resource allocation
- **Real-time Updates**: Dynamic content updates and notifications
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Built-in dark mode support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand
- **Charts**: Recharts
- **Deployment**: AWS Lambda + CloudFront + S3

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- AWS CLI configured (for deployment)

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd my-v0-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your OAuth providers in `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## AWS Deployment

This application is configured for deployment on AWS using the Serverless Framework.

### Prerequisites for AWS Deployment

1. Install AWS CLI and configure credentials:
```bash
aws configure
```

2. Install Serverless Framework globally:
```bash
npm install -g serverless
```

### Deployment Steps

1. Set up environment variables in AWS Systems Manager Parameter Store:
```bash
chmod +x scripts/setup-aws-env.sh
./scripts/setup-aws-env.sh [stage] [region]
```

2. Deploy the application:
```bash
npm run deploy:aws
```

3. Deploy static assets:
```bash
npm run deploy:static
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server locally
- `npm run lint` - Run ESLint
- `npm run deploy:aws` - Deploy to AWS (dev stage)
- `npm run deploy:aws:prod` - Deploy to AWS (production stage)
- `npm run deploy:static` - Deploy static assets to S3/CloudFront
- `npm run remove:aws` - Remove AWS deployment

## Environment Variables

The application uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | The canonical URL of your site | ✅ |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `MICROSOFT_CLIENT_ID` | Microsoft OAuth client ID | ✅ |
| `MICROSOFT_CLIENT_SECRET` | Microsoft OAuth client secret | ✅ |

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Authentication pages
│   ├── manager/           # Manager role pages
│   ├── allocator/         # Allocator role pages
│   └── ...
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── scripts/               # Deployment scripts
├── types/                 # TypeScript type definitions
├── serverless.yml         # AWS deployment configuration
└── index.js              # Lambda handler
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is private and proprietary.
