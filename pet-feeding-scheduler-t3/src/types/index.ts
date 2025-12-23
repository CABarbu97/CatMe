export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  familyIds?: string[]; // Support multiple families
  activeFamilyId?: string; // Currently selected family
  createdAt: Date;
}

export interface Family {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  memberIds: string[];
}

export interface Pet {
  id: string;
  name: string;
  type: string; // cat, dog, bird, etc.
  imageUrl?: string;
  familyId: string;
  mealtimes: Mealtime[];
  createdAt: Date;
}

export interface Mealtime {
  id: string;
  name: string; // "Breakfast", "Lunch", "Dinner", "Snack"
  time: string; // HH:mm format, e.g., "08:00"
}

export interface FeedingRecord {
  id: string;
  petId: string;
  mealtimeId: string;
  date: string; // YYYY-MM-DD format
  fedBy: string; // userId
  fedAt: Date;
  notes?: string;
}

export interface DailyFeedingStatus {
  petId: string;
  petName: string;
  petType: string;
  date: string;
  mealtimes: {
    mealtimeId: string;
    mealtimeName: string;
    time: string;
    isFed: boolean;
    fedBy?: string;
    fedByName?: string;
    fedAt?: Date;
    notes?: string;
  }[];
}
