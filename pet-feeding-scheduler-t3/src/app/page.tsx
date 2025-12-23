"use client";

import Link from "next/link";
import { useAuth } from "~/contexts/AuthContext";
import { FeedingDashboard } from "~/app/_components/feeding-dashboard";
import { PetManager } from "~/app/_components/pet-manager";
import { FamilySwitcher } from "~/app/_components/family-switcher";
import { UserMenu } from "~/app/_components/user-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export default function Home() {
  const { user, loading } = useAuth();
  const [showPetManager, setShowPetManager] = useState(false);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Pet <span className="text-[hsl(280,100%,70%)]">Feeding</span> Scheduler
          </h1>
          <p className="max-w-2xl text-center text-xl">
            Keep track of your pets' meals with your family. Never miss a feeding again!
          </p>
          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold no-underline transition hover:bg-[hsl(280,100%,60%)]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900 sm:text-2xl">
            🐾 Pet Feeding Scheduler
          </h1>
          <div className="flex items-center gap-3">
            {user.activeFamilyId && (
              <Button
                onClick={() => setShowPetManager(true)}
                variant="outline"
                className="text-sm"
              >
                Manage Pets
              </Button>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside>
            <FamilySwitcher />
          </aside>

          {/* Main Content Area */}
          <div className="space-y-8">
            {!user.activeFamilyId && user.familyIds.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow">
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome to Pet Feeding Scheduler!
                </h2>
                <p className="mt-2 text-gray-600">
                  Get started by creating or joining a family.
                </p>
              </div>
            ) : (
              <FeedingDashboard />
            )}
          </div>
        </div>
      </div>

      {/* Pet Manager Dialog */}
      <Dialog open={showPetManager} onOpenChange={setShowPetManager}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Pets</DialogTitle>
          </DialogHeader>
          <PetManager />
        </DialogContent>
      </Dialog>
    </main>
  );
}

