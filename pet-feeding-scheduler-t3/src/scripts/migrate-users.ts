/**
 * Migration script to update user documents from single family to multi-family support
 * 
 * This script:
 * 1. Finds all users with the old 'familyId' field
 * 2. Converts 'familyId' to 'familyIds' array
 * 3. Sets 'activeFamilyId' to the current family
 * 4. Removes the old 'familyId' field
 * 
 * Run this once: npx tsx src/scripts/migrate-users.ts
 */

import { db } from "../server/firebase/admin";

async function migrateUsers() {
  console.log("Starting user migration...");
  
  try {
    const usersSnapshot = await db.collection("users").get();
    let migratedCount = 0;
    let alreadyMigratedCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Check if user has old schema (familyId instead of familyIds)
      if (userData.familyId && !userData.familyIds) {
        console.log(`Migrating user ${userDoc.id}...`);
        
        await db.collection("users").doc(userDoc.id).update({
          familyIds: [userData.familyId],
          activeFamilyId: userData.familyId,
        });
        
        // Remove old field (optional - keeping it won't hurt but keeping data clean)
        await db.collection("users").doc(userDoc.id).update({
          familyId: null,
        } as any);
        
        migratedCount++;
        console.log(`✓ Migrated user ${userDoc.id}`);
      } else if (userData.familyIds) {
        alreadyMigratedCount++;
      }
    }

    console.log("\n✅ Migration complete!");
    console.log(`- Migrated: ${migratedCount} users`);
    console.log(`- Already migrated: ${alreadyMigratedCount} users`);
    console.log(`- Total users: ${usersSnapshot.docs.length}`);
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

migrateUsers();
