import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/firebase/admin";
import type { Family } from "~/types";

export const familyRouter = createTRPCRouter({
  // Get all families user belongs to
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const userDoc = await db.collection("users").doc(userId).get();
    const familyIds = (userDoc.data()?.familyIds ?? []) as string[];
    
    if (familyIds.length === 0) {
      return [];
    }

    const familyDocs = await Promise.all(
      familyIds.map((id) => db.collection("families").doc(id).get()),
    );

    return familyDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Family[];
  }),

  // Get current user's active family
  getMine: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    
    const activeFamilyId = userData?.activeFamilyId;
    const familyIds = (userData?.familyIds ?? []) as string[];
    const familyId = activeFamilyId ?? familyIds[0];
    
    if (!familyId) {
      return null;
    }

    const familyDoc = await db.collection("families").doc(familyId).get();
    
    if (!familyDoc.exists) {
      return null;
    }

    return {
      id: familyDoc.id,
      ...familyDoc.data(),
    } as Family;
  }),

  // Create a new family
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // Create family
      const familyRef = db.collection("families").doc();
      const family: Omit<Family, "id"> = {
        name: input.name,
        createdBy: userId,
        createdAt: new Date(),
        memberIds: [userId],
      };

      await familyRef.set(family);

      // Update user's familyIds and set as active
      const userDoc = await db.collection("users").doc(userId).get();
      const currentFamilyIds = (userDoc.data()?.familyIds ?? []) as string[];
      
      await db.collection("users").doc(userId).set(
        {
          familyIds: [...currentFamilyIds, familyRef.id],
          activeFamilyId: familyRef.id,
        },
        { merge: true },
      );

      return {
        id: familyRef.id,
        ...family,
      };
    }),

  // Join a family
  join: protectedProcedure
    .input(
      z.object({
        familyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      // Check if family exists
      const familyDoc = await db.collection("families").doc(input.familyId).get();
      if (!familyDoc.exists) {
        throw new Error("Family not found");
      }

      const familyData = familyDoc.data() as Family;

      // Check if user is already in family
      if (familyData.memberIds.includes(userId)) {
        throw new Error("Already a member of this family");
      }

      // Add user to family members
      await db.collection("families").doc(input.familyId).update({
        memberIds: [...familyData.memberIds, userId],
      });

      // Update user's familyIds
      const userDoc = await db.collection("users").doc(userId).get();
      const currentFamilyIds = (userDoc.data()?.familyIds ?? []) as string[];
      
      await db.collection("users").doc(userId).set(
        {
          familyIds: [...currentFamilyIds, input.familyId],
          activeFamilyId: input.familyId,
        },
        { merge: true },
      );

      return { success: true };
    }),

  // Get all members of current family
  getMembers: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    
    const userDoc = await db.collection("users").doc(userId).get();
    const familyId = userDoc.data()?.familyId;
    
    if (!familyId) {
      return [];
    }

    const familyDoc = await db.collection("families").doc(familyId).get();
    const familyData = familyDoc.data() as Family;

    const memberDocs = await Promise.all(
      familyData.memberIds.map((id) => db.collection("users").doc(id).get()),
    );

    return memberDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  }),
});
