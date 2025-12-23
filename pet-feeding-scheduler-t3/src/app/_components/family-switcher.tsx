"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Users, Plus, Copy, Check } from "lucide-react";
import { useState } from "react";

export function FamilySwitcher() {
  const { data: families, refetch } = api.family.getAll.useQuery();
  const { data: currentFamily } = api.family.getMine.useQuery();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const switchFamilyMutation = api.user.switchFamily.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const createFamilyMutation = api.family.create.useMutation({
    onSuccess: () => {
      void refetch();
      setShowCreateForm(false);
      setFamilyName("");
      window.location.reload();
    },
  });

  const joinFamilyMutation = api.family.join.useMutation({
    onSuccess: () => {
      void refetch();
      setShowJoinForm(false);
      setFamilyId("");
      window.location.reload();
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
    if (familyId.trim()) {
      joinFamilyMutation.mutate({ familyId: familyId.trim() });
    }
  };

  const copyFamilyId = async (id: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(id);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = id;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Still show success to user as the ID is visible
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!families || families.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-bold">Family</h2>
        </div>
        <p className="text-gray-600 mb-4">You're not part of any family yet.</p>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Family
          </Button>
          <Button variant="outline" onClick={() => setShowJoinForm(true)}>
            Join Family
          </Button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateFamily} className="mt-4 space-y-3">
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Family name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">Create</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {showJoinForm && (
          <form onSubmit={handleJoinFamily} className="mt-4 space-y-3">
            <input
              type="text"
              value={familyId}
              onChange={(e) => setFamilyId(e.target.value)}
              placeholder="Family ID"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">Join</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowJoinForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-bold">Families</h2>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowJoinForm(true)}>
            Join
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {families.map((family) => (
          <div
            key={family.id}
            className={`rounded-lg border p-3 ${
              currentFamily?.id === family.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">{family.name}</div>
                <div className="text-xs text-gray-500">
                  {family.memberIds.length} member{family.memberIds.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentFamily?.id !== family.id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => switchFamilyMutation.mutate({ familyId: family.id })}
                    disabled={switchFamilyMutation.isPending}
                  >
                    Switch
                  </Button>
                )}
                {currentFamily?.id === family.id && (
                  <span className="text-xs font-medium text-blue-600">Active</span>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 rounded bg-gray-100 px-2 py-1">
                <div className="text-[10px] font-medium text-gray-500">Family ID (share to invite)</div>
                <div className="font-mono text-xs text-gray-700">{family.id}</div>
              </div>
              <button
                onClick={() => copyFamilyId(family.id)}
                className="rounded p-2 hover:bg-gray-200"
                title="Copy Family ID"
              >
                {copiedId === family.id ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateFamily} className="mt-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Family name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={createFamilyMutation.isPending}>
              {createFamilyMutation.isPending ? "Creating..." : "Create"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {showJoinForm && (
        <form onSubmit={handleJoinFamily} className="mt-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <input
            type="text"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            placeholder="Family ID"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={joinFamilyMutation.isPending}>
              {joinFamilyMutation.isPending ? "Joining..." : "Join"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowJoinForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
