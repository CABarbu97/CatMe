# Pet Feeding Scheduler

A modern pet feeding scheduler and management application built with the T3 Stack (Next.js, tRPC, TypeScript) and Firebase.

## Features

- 🐾 **Multi-Pet Management**: Track multiple pets with different feeding schedules
- 👨‍👩‍👧‍👦 **Family Sharing**: Join or create families to share pet care responsibilities
- 📅 **Daily Feeding Dashboard**: Interactive table showing which pets have been fed
- ⏰ **Configurable Mealtimes**: Set custom feeding times for each pet
- ✅ **One-Click Feeding Tracking**: Mark meals as fed with a single click
- 📊 **Progress Overview**: See feeding completion rates at a glance
- 🔐 **GitHub Authentication**: Secure sign-in with GitHub OAuth

## Tech Stack

- [Next.js 15](https://nextjs.org) - React framework with App Router
- [tRPC](https://trpc.io) - End-to-end typesafe APIs
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [TailwindCSS v4](https://tailwindcss.com) - Styling
- [Better Auth](https://better-auth.com) - Authentication
- [Firebase](https://firebase.google.com) - Database (Firestore)
- [date-fns](https://date-fns.org) - Date utilities

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- A Firebase project
- GitHub OAuth app for authentication

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and add a web app
   - Copy the Firebase configuration
4. Get Firebase Admin credentials:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file (you'll need values from it)

### GitHub OAuth Setup

1. Go to [GitHub Settings > Developer Settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and generate a Client Secret

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pet-feeding-scheduler-t3
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy the environment variables file:
```bash
cp .env.example .env
```

4. Fill in your `.env` file:
```bash
# Better Auth
BETTER_AUTH_SECRET="your-random-secret-here"  # Generate with: openssl rand -base64 32

# GitHub OAuth
BETTER_AUTH_GITHUB_CLIENT_ID="your-github-client-id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your-github-client-secret"

# Firebase Admin (from service account JSON)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client (from Firebase web app config)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### First Time Setup

1. Sign in with your GitHub account
2. Create a new family or join an existing one (using family ID)
3. Add your pets with their feeding schedules
4. Start tracking meals!

### Daily Use

1. Check the feeding dashboard to see which pets need to be fed
2. Click the checkbox next to each meal when you feed your pet
3. See who fed each pet and when
4. Navigate to different dates to view historical data

### Managing Pets

- Add new pets with custom mealtimes
- Edit mealtime schedules as needed
- Remove pets when necessary

### Family Sharing

- Share your family ID with family members
- Everyone in the family can:
  - View all pets
  - Mark meals as fed
  - Add or remove pets
  - See who fed each meal

## Project Structure

```
src/
├── app/
│   ├── _components/       # React components
│   │   ├── feeding-dashboard.tsx
│   │   ├── pet-manager.tsx
│   │   └── family-manager.tsx
│   ├── api/              # API routes
│   ├── layout.tsx
│   └── page.tsx
├── server/
│   ├── api/              # tRPC routers
│   │   ├── routers/
│   │   │   ├── family.ts
│   │   │   ├── pet.ts
│   │   │   └── feeding.ts
│   │   ├── root.ts
│   │   └── trpc.ts
│   ├── better-auth/      # Authentication config
│   └── firebase/         # Firebase initialization
├── lib/
│   └── firebase/         # Firebase client
├── types/                # TypeScript types
└── trpc/                 # tRPC client setup
```

## Firestore Collections

The app uses the following Firestore collections:

- `users` - User profiles with family associations
- `families` - Family groups with member lists
- `pets` - Pet information and feeding schedules
- `feedingRecords` - Individual feeding event records

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add all environment variables from your `.env` file
4. Deploy!

### Firebase Security Rules

Don't forget to set up proper Firestore security rules in production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Add your security rules here
    // Example: Only allow authenticated users to read/write their family's data
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
