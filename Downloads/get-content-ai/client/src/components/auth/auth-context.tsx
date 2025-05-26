import React, { createContext, useState, useEffect, useContext } from "react";
import { apiRequest } from "@/lib/queryClient";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

interface User {
  id: number;
  username: string;
  // Additional fields for Firebase users
  firebaseId?: string;
  email?: string;
  photoURL?: string;
  // Subscription fields
  subscriptionStatus?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    loadUser();
  }, []);

  async function loadUser() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      console.log("User not authenticated");
      // User is not authenticated, that's ok
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string, password: string) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to login");
      }

      const userData = await response.json();
      setUser(userData);
      
      // Redirect to the page they came from
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectTo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  async function signup(username: string, password: string) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create account");
      }

      const userData = await response.json();
      setUser(userData);
      
      // Redirect to the page they came from
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectTo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  async function loginWithGoogle() {
    try {
      setIsLoading(true);
      setError(null);
      
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the Google user info
      const { uid, displayName, email, photoURL } = result.user;
      const googleUsername = displayName || email?.split('@')[0] || 'user'; 
      
      // Send the Google user info to our backend for authentication/registration
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          firebaseId: uid,
          username: googleUsername,
          email: email,
          photoURL: photoURL
        }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to login with Google");
      }
      
      const userData = await response.json();
      setUser({
        ...userData,
        firebaseId: uid,
        email: email || undefined,
        photoURL: photoURL || undefined
      });
      
      // Redirect to home page after successful Google login
      window.location.href = '/';
    } catch (err) {
      // Sign out from Firebase if our backend auth failed
      await signOut(auth);
      setError(err instanceof Error ? err.message : "Failed to login with Google");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }
  
  async function logout() {
    try {
      setIsLoading(true);
      
      // Logout from our backend
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to logout");
      }
      
      // Also logout from Firebase if user is signed in there
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
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