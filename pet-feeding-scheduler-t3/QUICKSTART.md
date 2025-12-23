# Pet Feeding Scheduler - Quick Start Guide

## What You Need

1. **Firebase Account** - Free tier is sufficient
2. **GitHub Account** - For OAuth authentication  
3. **Node.js & pnpm** - Already installed!

## Step-by-Step Setup (5 minutes)

### 1. Firebase Setup

```bash
# Visit: https://console.firebase.google.com
# 1. Create a new Firebase project
# 2. Click "Firestore Database" → Create Database → Start in test mode
# 3. Go to Project Settings (gear icon) → General tab
# 4. Scroll to "Your apps" → Click web icon (</>) → Register app
# 5. Copy the firebaseConfig object values
# 6. Go to "Service accounts" tab → Generate new private key
# 7. Download the JSON file
```

### 2. GitHub OAuth

```bash
# Visit: https://github.com/settings/developers
# 1. Click "New OAuth App"
# 2. Fill in:
#    - Application name: Pet Feeding Scheduler (or any name)
#    - Homepage URL: http://localhost:3000
#    - Authorization callback URL: http://localhost:3000/api/auth/callback/github
# 3. Click "Register application"
# 4. Copy the Client ID
# 5. Click "Generate a new client secret" and copy it
```

### 3. Environment Setup

Create a `.env` file in this directory:

```bash
cp .env.example .env
```

Then fill it with your values:

```env
# Generate a random secret:
BETTER_AUTH_SECRET="run: openssl rand -base64 32"

# From GitHub OAuth:
BETTER_AUTH_GITHUB_CLIENT_ID="your_github_client_id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your_github_client_secret"

# From Firebase Service Account JSON:
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-key-here\n-----END PRIVATE KEY-----\n"

# From Firebase Web App Config:
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

### 4. Run the App

```bash
# Install dependencies (if not already done)
pnpm install

# Start the development server
pnpm dev
```

Visit: http://localhost:3000

### 5. First Use

1. Click "Sign in with Github"
2. Authorize the app
3. Create a new family or join an existing one
4. Add your first pet!
5. Start tracking meals 🐾

## Troubleshooting

### "Module not found" errors
```bash
pnpm install
```

### Authentication not working
- Check GitHub OAuth callback URL matches exactly
- Verify .env variables are set correctly
- Restart the dev server after changing .env

### Firebase errors
- Ensure Firestore is enabled (not Realtime Database)
- Check service account permissions
- Verify FIREBASE_PRIVATE_KEY includes `\n` for newlines

## Features

- ✅ Track multiple pets
- ✅ Custom feeding schedules
- ✅ Family sharing
- ✅ Daily dashboard
- ✅ Historical tracking
- ✅ One-click meal logging

## Need Help?

Check the full README.md for detailed documentation!
