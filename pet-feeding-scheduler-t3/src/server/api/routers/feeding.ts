import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/firebase/admin";
import { format } from "date-fns";
import type { FeedingRecord, DailyFeedingStatus, Pet } from "~/types";

export const feedingRouter = createTRPCRouter({
  // Get daily feeding status for all pets
  getDailyStatus: protectedProcedure
    .input(
      z.object({
        date: z.string().optional(), // YYYY-MM-DD format
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const date = input.date ?? format(new Date(), "yyyy-MM-dd");
      
      // Get user's active family
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      const activeFamilyId = userData?.activeFamilyId;
      const familyIds = (userData?.familyIds ?? []) as string[];
      const familyId = activeFamilyId ?? familyIds[0];
      
      if (!familyId) {
        return [];
      }

      // Get all pets in family
      const petsSnapshot = await db
        .collection("pets")
        .where("familyId", "==", familyId)
        .get();

      const pets = petsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pet[];

      // Get all feeding records for the date
      const feedingsSnapshot = await db
        .collection("feedingRecords")
        .where("date", "==", date)
        .get();

      const feedingRecords = feedingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FeedingRecord[];

      // Get all family members for names
      const familyDoc = await db.collection("families").doc(familyId).get();
      const memberIds = familyDoc.data()?.memberIds ?? [];
      const memberDocs = await Promise.all(
        memberIds.map((id: string) => db.collection("users").doc(id).get()),
      );
      const members = new Map(
        memberDocs
          .filter((doc) => doc.exists)
          .map((doc) => [doc.id, doc.data()]),
      );

      // Build daily feeding status
      const status: DailyFeedingStatus[] = pets.map((pet) => {
        const mealtimes = pet.mealtimes.map((mealtime) => {
          const feeding = feedingRecords.find(
            (f) => f.petId === pet.id && f.mealtimeId === mealtime.id,
          );

          return {
            mealtimeId: mealtime.id,
            mealtimeName: mealtime.name,
            time: mealtime.time,
            isFed: !!feeding,
            fedBy: feeding?.fedBy,
            fedByName: feeding?.fedBy ? (members.get(feeding.fedBy)?.name as string) : undefined,
            fedAt: feeding?.fedAt,
            notes: feeding?.notes,
          };
        });

        return {
          petId: pet.id,
          petName: pet.name,
          petType: pet.type,
          date,
          mealtimes,
        };
      });

      return status;
    }),

  // Mark a meal as fed
  markAsFed: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        mealtimeId: z.string(),
        date: z.string(), // YYYY-MM-DD
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // Check if already fed
      const existingSnapshot = await db
        .collection("feedingRecords")
        .where("petId", "==", input.petId)
        .where("mealtimeId", "==", input.mealtimeId)
        .where("date", "==", input.date)
        .limit(1)
        .get();

      if (!existingSnapshot.empty) {
        throw new Error("This meal has already been marked as fed");
      }

      const recordRef = db.collection("feedingRecords").doc();
      const record: Omit<FeedingRecord, "id"> & { notes?: string } = {
        petId: input.petId,
        mealtimeId: input.mealtimeId,
        date: input.date,
        fedBy: userId,
        fedAt: new Date(),
      };

      // Only add notes if they exist
      if (input.notes) {
        record.notes = input.notes;
      }

      await recordRef.set(record);

      return {
        id: recordRef.id,
        ...record,
      };
    }),

  // Unmark a meal (delete feeding record)
  unmarkAsFed: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        mealtimeId: z.string(),
        date: z.string(), // YYYY-MM-DD
      }),
    )
    .mutation(async ({ input }) => {
      const snapshot = await db
        .collection("feedingRecords")
        .where("petId", "==", input.petId)
        .where("mealtimeId", "==", input.mealtimeId)
        .where("date", "==", input.date)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error("Feeding record not found");
      }

      await snapshot.docs[0]!.ref.delete();

      return { success: true };
    }),

  // Get feeding history for a pet
  getHistory: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        limit: z.number().min(1).max(100).default(30),
      }),
    )
    .query(async ({ input }) => {
      const snapshot = await db
        .collection("feedingRecords")
        .where("petId", "==", input.petId)
        .orderBy("fedAt", "desc")
        .limit(input.limit)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FeedingRecord[];
    }),
});
