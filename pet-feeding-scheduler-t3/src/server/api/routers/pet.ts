import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/firebase/admin";
import type { Pet, Mealtime } from "~/types";

export const petRouter = createTRPCRouter({
  // Get all pets in user's family
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    const activeFamilyId = userData?.activeFamilyId;
    const familyIds = (userData?.familyIds ?? []) as string[];
    const familyId = activeFamilyId ?? familyIds[0];
    
    if (!familyId) {
      return [];
    }

    const petsSnapshot = await db
      .collection("pets")
      .where("familyId", "==", familyId)
      .get();

    // Sort in memory instead of using Firestore orderBy to avoid index requirement
    const pets = petsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Pet[];

    return pets.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return timeB - timeA;
    });
  }),

  // Get a single pet
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const petDoc = await db.collection("pets").doc(input.id).get();
      
      if (!petDoc.exists) {
        throw new Error("Pet not found");
      }

      return {
        id: petDoc.id,
        ...petDoc.data(),
      } as Pet;
    }),

  // Create a new pet
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string().min(1),
        imageUrl: z.string().optional(),
        mealtimes: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            time: z.string().regex(/^\d{2}:\d{2}$/),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const userDoc = await db.collection("users").doc(userId).get();
      const userData = userDoc.data();
      const activeFamilyId = userData?.activeFamilyId;
      const familyIds = (userData?.familyIds ?? []) as string[];
      const familyId = activeFamilyId ?? familyIds[0];
      
      if (!familyId) {
        throw new Error("User must belong to a family to create pets");
      }

      const petRef = db.collection("pets").doc();
      const pet: Record<string, unknown> = {
        name: input.name,
        type: input.type,
        familyId,
        mealtimes: input.mealtimes,
        createdAt: new Date(),
      };

      // Only add imageUrl if it's provided
      if (input.imageUrl) {
        pet.imageUrl = input.imageUrl;
      }

      await petRef.set(pet);

      return {
        id: petRef.id,
        ...pet,
      };
    }),

  // Update a pet
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        type: z.string().min(1).optional(),
        imageUrl: z.string().optional(),
        mealtimes: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            time: z.string().regex(/^\d{2}:\d{2}$/),
          }),
        ).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      
      const petRef = db.collection("pets").doc(id);
      const petDoc = await petRef.get();
      
      if (!petDoc.exists) {
        throw new Error("Pet not found");
      }

      await petRef.update(updates);

      return { success: true };
    }),

  // Delete a pet
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.collection("pets").doc(input.id).delete();
      
      // Also delete all feeding records for this pet
      const feedingsSnapshot = await db
        .collection("feedingRecords")
        .where("petId", "==", input.id)
        .get();

      const batch = db.batch();
      feedingsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      return { success: true };
    }),
});
