"use client";

import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { api } from "~/trpc/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Check, Square, MessageSquare } from "lucide-react";

export function FeedingDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notesDialog, setNotesDialog] = useState<{
    petId: string;
    petName: string;
    mealtimeId: string;
    mealtimeName: string;
    currentNotes?: string;
  } | null>(null);
  const [notes, setNotes] = useState("");
  
  const dateString = format(selectedDate, "yyyy-MM-dd");

  const { data: feedingStatus, isLoading, refetch } = api.feeding.getDailyStatus.useQuery({
    date: dateString,
  });

  const markAsFedMutation = api.feeding.markAsFed.useMutation({
    onSuccess: () => {
      void refetch();
      setNotesDialog(null);
      setNotes("");
    },
  });

  const unmarkAsFedMutation = api.feeding.unmarkAsFed.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleMarkAsFed = (petId: string, mealtimeId: string, withNotes = false, petName = "", mealtimeName = "") => {
    if (withNotes) {
      setNotesDialog({ petId, petName, mealtimeId, mealtimeName });
      setNotes("");
    } else {
      markAsFedMutation.mutate({
        petId,
        mealtimeId,
        date: dateString,
      });
    }
  };

  const handleSaveWithNotes = () => {
    if (!notesDialog) return;
    
    markAsFedMutation.mutate({
      petId: notesDialog.petId,
      mealtimeId: notesDialog.mealtimeId,
      date: dateString,
      notes: notes.trim() || undefined,
    });
  };

  const handleUnmarkAsFed = (petId: string, mealtimeId: string) => {
    unmarkAsFedMutation.mutate({
      petId,
      mealtimeId,
      date: dateString,
    });
  };

  const goToPreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!feedingStatus || feedingStatus.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-500">No pets found</p>
        <p className="text-sm text-gray-400">Add some pets to start tracking their meals</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Daily Feeding Tracker</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousDay}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
          >
            ← Previous
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </span>
            {!isToday && (
              <button
                onClick={goToToday}
                className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
              >
                Today
              </button>
            )}
          </div>
          <button
            onClick={goToNextDay}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Feeding Table */}
      <div className="overflow-x-auto rounded-lg border-2 border-gray-300 bg-white shadow-md">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gradient-to-r from-purple-50 to-pink-50">
              <th className="sticky left-0 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-4 text-left text-sm font-bold text-gray-900 sm:px-6">Pet</th>
              {feedingStatus[0]?.mealtimes.map((mealtime) => (
                <th key={mealtime.mealtimeId} className="min-w-[140px] px-4 py-4 text-center text-sm font-bold text-gray-900 sm:px-6">
                  <div className="font-bold">{mealtime.mealtimeName}</div>
                  <div className="text-xs font-semibold text-gray-600">{mealtime.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-gray-200">
            {feedingStatus.map((pet) => (
              <tr key={pet.petId} className="hover:bg-purple-50/30">
                <td className="sticky left-0 bg-white px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-md sm:h-10 sm:w-10 sm:text-lg">
                      {pet.petName[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-bold text-gray-900">{pet.petName}</div>
                      <div className="text-xs capitalize text-gray-600 sm:text-sm">{pet.petType}</div>
                    </div>
                  </div>
                </td>
                {pet.mealtimes.map((mealtime) => (
                  <td key={mealtime.mealtimeId} className="border-l border-gray-200 px-4 py-4 text-center sm:px-6">
                    <div className="flex flex-col items-center gap-2">
                      {mealtime.isFed ? (
                        <>
                          <button
                            onClick={() => handleUnmarkAsFed(pet.petId, mealtime.mealtimeId)}
                            disabled={unmarkAsFedMutation.isPending}
                            className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-green-500 bg-green-500 text-white shadow-lg transition-all hover:scale-105 hover:bg-green-600 disabled:opacity-50"
                            title={`Fed by ${mealtime.fedByName ?? "Unknown"}`}
                          >
                            <Check className="h-7 w-7 stroke-[3]" />
                          </button>
                          {mealtime.notes && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <MessageSquare className="h-3 w-3" />
                              <span className="max-w-[120px] truncate" title={mealtime.notes}>
                                {mealtime.notes}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 sm:flex-row">
                          <button
                            onClick={() => handleMarkAsFed(pet.petId, mealtime.mealtimeId)}
                            disabled={markAsFedMutation.isPending}
                            className="flex h-14 w-14 items-center justify-center rounded-xl border-[3px] border-gray-400 bg-white text-gray-400 shadow-sm transition-all hover:scale-105 hover:border-green-500 hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
                            title="Mark as fed"
                          >
                            <Square className="h-8 w-8 stroke-[3]" />
                          </button>
                          <button
                            onClick={() => handleMarkAsFed(pet.petId, mealtime.mealtimeId, true, pet.petName, mealtime.mealtimeName)}
                            disabled={markAsFedMutation.isPending}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-blue-300 bg-blue-50 text-blue-600 shadow-sm transition-all hover:scale-105 hover:bg-blue-100 disabled:opacity-50"
                            title="Add notes"
                          >
                            <MessageSquare className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes Dialog */}
      <Dialog open={!!notesDialog} onOpenChange={() => setNotesDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Notes - {notesDialog?.petName} ({notesDialog?.mealtimeName})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Ate everything, Left some food, etc."
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveWithNotes} disabled={markAsFedMutation.isPending}>
                {markAsFedMutation.isPending ? "Saving..." : "Mark as Fed"}
              </Button>
              <Button variant="outline" onClick={() => setNotesDialog(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
