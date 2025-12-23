"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function FamilyManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [joiningFamilyId, setJoiningFamilyId] = useState("");

  const { data: family, refetch } = api.family.getMine.useQuery();
  const { data: members } = api.family.getMembers.useQuery();

  const createFamilyMutation = api.family.create.useMutation({
    onSuccess: () => {
      void refetch();
      setIsCreating(false);
      setFamilyName("");
    },
  });

  const joinFamilyMutation = api.family.join.useMutation({
    onSuccess: () => {
      void refetch();
      setJoiningFamilyId("");
    },
  });

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyName.trim()) {
      createFamilyMutation.mutate({ name: familyName.trim() });
    }
  };

  const handleJoinFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (joiningFamilyId.trim()) {
      joinFamilyMutation.mutate({ familyId: joiningFamilyId.trim() });
    }
  };

  if (!family) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Family Setup</h2>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-4 text-gray-600">
            You need to create or join a family to start managing pets.
          </p>

          <div className="space-y-6">
            {/* Create Family */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Create a New Family</h3>
              <form onSubmit={handleCreateFamily} className="space-y-3">
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter family name"
                  required
                />
                <button
                  type="submit"
                  disabled={createFamilyMutation.isPending}
                  className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {createFamilyMutation.isPending ? "Creating..." : "Create Family"}
                </button>
              </form>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Join Family */}
            <div>
              <h3 className="mb-3 text-lg font-semibold">Join an Existing Family</h3>
              <form onSubmit={handleJoinFamily} className="space-y-3">
                <input
                  type="text"
                  value={joiningFamilyId}
                  onChange={(e) => setJoiningFamilyId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter family ID"
                  required
                />
                <button
                  type="submit"
                  disabled={joinFamilyMutation.isPending}
                  className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {joinFamilyMutation.isPending ? "Joining..." : "Join Family"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Family</h2>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{family.name}</h3>
            <p className="text-sm text-gray-500">Family ID: {family.id}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(family.id);
              alert("Family ID copied to clipboard!");
            }}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Copy ID
          </button>
        </div>

        <div className="mt-6">
          <h4 className="mb-3 font-semibold text-gray-700">
            Family Members ({members?.length ?? 0})
          </h4>
          <div className="space-y-2">
            {members?.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                  {member.name?.[0]?.toUpperCase() ?? member.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name ?? "User"}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
