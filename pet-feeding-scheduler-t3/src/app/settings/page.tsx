"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserSettingsPage() {
  const router = useRouter();
  const { data: user, refetch } = api.user.getCurrent.useQuery();
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  const handleSave = () => {
    updateUserMutation.mutate({
      name: name || undefined,
      avatarUrl: avatarUrl || undefined,
    });
    setIsEditing(false);
    setName("");
    setAvatarUrl("");
  };

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold">User Settings</h1>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatarUrl} alt={user.name ?? ""} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatarUrl" className="mb-2 block">
                  Avatar URL
                </Label>
                <div className="flex gap-2">
                  <input
                    id="avatarUrl"
                    type="text"
                    value={isEditing ? avatarUrl : user.avatarUrl ?? ""}
                    onChange={(e) => {
                      setAvatarUrl(e.target.value);
                      setIsEditing(true);
                    }}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter an image URL or upload an avatar
                </p>
              </div>
            </div>

            {/* Name Section */}
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Display Name
              </Label>
              <input
                id="name"
                type="text"
                value={isEditing ? name : user.name ?? ""}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="Your name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Email Section (Read-only) */}
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <input
                id="email"
                type="email"
                value={user.email ?? ""}
                disabled
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed
              </p>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName("");
                    setAvatarUrl("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Account Info */}
            <div className="border-t pt-6">
              <h2 className="mb-4 text-lg font-semibold">Account Information</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Account ID:</span>
                  <span className="font-mono text-xs">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member since:</span>
                  <span>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
