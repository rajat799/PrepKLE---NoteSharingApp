"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isMainAdmin: boolean;
  isSubAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isMainAdmin: false,
  isSubAdmin: false,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser?.email) {
        const emailLower = firebaseUser.email.toLowerCase();
        
        // 1. Check Main Admin (Environment Variable)
        const envAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);
          
        if (envAdmins.includes(emailLower)) {
          setIsMainAdmin(true);
          setIsSubAdmin(false);
          setIsAdmin(true);
        } else {
          // 2. Check Sub Admin (Firestore)
          try {
            const docRef = doc(db, "admins", emailLower);
            const docSnap = await getDoc(docRef);
            
            const isSub = docSnap.exists();
            setIsMainAdmin(false);
            setIsSubAdmin(isSub);
            setIsAdmin(isSub);
          } catch (error) {
            console.error("Failed to verify sub-admin status:", error);
            setIsMainAdmin(false);
            setIsSubAdmin(false);
            setIsAdmin(false);
          }
        }
      } else {
        setIsMainAdmin(false);
        setIsSubAdmin(false);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isMainAdmin, isSubAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
