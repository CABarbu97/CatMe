"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function PetManager() {
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [mealtimes, setMealtimes] = useState([
    { id: "breakfast", name: "Breakfast", time: "08:00" },
    { id: "dinner", name: "Dinner", time: "18:00" },
  ]);

  const { data: pets, refetch } = api.pet.getAll.useQuery();
  const createPetMutation = api.pet.create.useMutation({
    onSuccess: () => {
      void refetch();
      setIsAddingPet(false);
      setPetName("");
      setPetType("");
      setMealtimes([
        { id: "breakfast", name: "Breakfast", time: "08:00" },
        { id: "dinner", name: "Dinner", time: "18:00" },
      ]);
    },
  });

  const deletePetMutation = api.pet.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (petName.trim() && petType.trim() && mealtimes.length > 0) {
      createPetMutation.mutate({
        name: petName.trim(),
        type: petType.trim(),
        mealtimes,
      });
    }
  };

  const addMealtime = () => {
    const newId = `meal-${Date.now()}`;
    setMealtimes([...mealtimes, { id: newId, name: "", time: "12:00" }]);
  };

  const removeMealtime = (id: string) => {
    setMealtimes(mealtimes.filter((m) => m.id !== id));
  };

  const updateMealtime = (id: string, field: "name" | "time", value: string) => {
    setMealtimes(
      mealtimes.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Pets</h2>
        <button
          onClick={() => setIsAddingPet(!isAddingPet)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          {isAddingPet ? "Cancel" : "+ Add Pet"}
        </button>
      </div>

      {isAddingPet && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-4 text-lg font-semibold">Add New Pet</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Pet Name
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Fluffy"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Pet Type
              </label>
              <input
                type="text"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Cat, Dog, Bird"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Mealtimes
                </label>
                <button
                  type="button"
                  onClick={addMealtime}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  + Add Mealtime
                </button>
              </div>
              <div className="space-y-2">
                {mealtimes.map((mealtime) => (
                  <div key={mealtime.id} className="flex gap-2">
                    <input
                      type="text"
                      value={mealtime.name}
                      onChange={(e) =>
                        updateMealtime(mealtime.id, "name", e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Meal name"
                      required
                    />
                    <input
                      type="time"
                      value={mealtime.time}
                      onChange={(e) =>
                        updateMealtime(mealtime.id, "time", e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                      required
                    />
                    {mealtimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMealtime(mealtime.id)}
                        className="rounded-lg bg-red-100 px-3 text-red-600 hover:bg-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={createPetMutation.isPending}
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {createPetMutation.isPending ? "Adding..." : "Add Pet"}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingPet(false)}
                className="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Pets List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pets?.map((pet) => (
          <div
            key={pet.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-xl font-bold text-white">
                  {pet.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                  <p className="text-sm capitalize text-gray-500">{pet.type}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${pet.name}?`)) {
                    deletePetMutation.mutate({ id: pet.id });
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500">Mealtimes:</p>
              {pet.mealtimes.map((mealtime) => (
                <div
                  key={mealtime.id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{mealtime.name}</span>
                  <span className="font-mono text-gray-500">{mealtime.time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!pets || pets.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <p className="text-gray-500">No pets yet. Add your first pet to get started!</p>
        </div>
      ) : null}
    </div>
  );
}
