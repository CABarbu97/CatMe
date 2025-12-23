export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          🐾 Pet Feeding Scheduler - Setup Guide
        </h1>

        <div className="space-y-6">
          {/* Firebase Setup */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              1. Firebase Setup
            </h2>
            <ol className="list-decimal space-y-3 pl-6 text-gray-700">
              <li>
                Go to{" "}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Firebase Console
                </a>
              </li>
              <li>Create a new project or select an existing one</li>
              <li>Enable Firestore Database in the project</li>
              <li>
                Go to Project Settings → General → Your apps → Add a web app
              </li>
              <li>Copy the Firebase configuration values</li>
              <li>
                Go to Project Settings → Service Accounts → Generate new private key
              </li>
              <li>Download the JSON file with admin credentials</li>
            </ol>
          </div>

          {/* GitHub OAuth */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              2. GitHub OAuth Setup
            </h2>
            <ol className="list-decimal space-y-3 pl-6 text-gray-700">
              <li>
                Go to{" "}
                <a
                  href="https://github.com/settings/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GitHub Developer Settings
                </a>
              </li>
              <li>Click "New OAuth App"</li>
              <li>
                Set Authorization callback URL to:{" "}
                <code className="rounded bg-gray-100 px-2 py-1">
                  http://localhost:3000/api/auth/callback/github
                </code>
              </li>
              <li>Copy the Client ID and generate a Client Secret</li>
            </ol>
          </div>

          {/* Environment Variables */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              3. Environment Variables
            </h2>
            <p className="mb-4 text-gray-700">
              Create a <code className="rounded bg-gray-100 px-2 py-1">.env</code> file
              in the root directory with the following variables:
            </p>
            <div className="overflow-x-auto">
              <pre className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
{`# Better Auth
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"

# GitHub OAuth
BETTER_AUTH_GITHUB_CLIENT_ID="your-github-client-id"
BETTER_AUTH_GITHUB_CLIENT_SECRET="your-github-client-secret"

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"

# Firebase Client (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"`}
              </pre>
            </div>
          </div>

          {/* Run the app */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              4. Run the Application
            </h2>
            <ol className="list-decimal space-y-3 pl-6 text-gray-700">
              <li>
                Install dependencies:{" "}
                <code className="rounded bg-gray-100 px-2 py-1">pnpm install</code>
              </li>
              <li>
                Start the dev server:{" "}
                <code className="rounded bg-gray-100 px-2 py-1">pnpm dev</code>
              </li>
              <li>
                Open{" "}
                <a
                  href="http://localhost:3000"
                  className="text-blue-600 hover:underline"
                >
                  http://localhost:3000
                </a>
              </li>
            </ol>
          </div>

          {/* Usage Guide */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-green-900">
              🎉 You're All Set!
            </h2>
            <p className="mb-4 text-green-800">
              Once configured, here's how to use the app:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-green-800">
              <li>Sign in with GitHub</li>
              <li>Create or join a family</li>
              <li>Add your pets with their feeding schedules</li>
              <li>Start tracking meals on the dashboard</li>
              <li>Share your family ID with other family members</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
