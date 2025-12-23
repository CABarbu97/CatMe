import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/firebase/admin";
import type { User } from "~/types";

export const userRouter = createTRPCRouter({
  // Get current user
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    const userDoc = await db.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      return null;
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
    } as User;
  }),

  // Update user profile
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        avatarUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const updateData: Record<string, unknown> = {};

      if (input.name) {
        updateData.name = input.name;
      }
      if (input.avatarUrl !== undefined) {
        updateData.avatarUrl = input.avatarUrl;
      }

      if (Object.keys(updateData).length > 0) {
        await db.collection("users").doc(userId).update(updateData);
      }

      return { success: true };
    }),

  // Switch active family
  switchFamily: protectedProcedure
    .input(z.object({ familyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      
      // Verify user is member of the family
      const userDoc = await db.collection("users").doc(userId).get();
      const familyIds = (userDoc.data()?.familyIds ?? []) as string[];
      
      if (!familyIds.includes(input.familyId)) {
        throw new Error("User is not a member of this family");
      }

      await db.collection("users").doc(userId).update({
        activeFamilyId: input.familyId,
      });

      return { success: true };
    }),
});
