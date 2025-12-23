"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, clientDb } from "~/lib/firebase/client";
import type { User } from "~/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(clientDb, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data() as User);
      } else {
        // User doesn't have a Firestore document, create one
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName ?? firebaseUser.email!.split("@")[0] ?? "User",
          familyIds: [],
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(clientDb, "users", firebaseUser.uid), userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // If there's an error loading user data, sign out
      await firebaseSignOut(auth);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { user: firebaseUser } = userCredential;

    // Create user document in Firestore
    const userData: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name,
      familyIds: [],
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(clientDb, "users", firebaseUser.uid), userData);
    setUser(userData);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      await loadUserData(firebaseUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, loading, signIn, signUp, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
