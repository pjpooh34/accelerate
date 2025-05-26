import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { insertUserSchema } from "@shared/schema";

// Session management interface
export interface SessionData {
  userId: number;
}

// Login schema validation
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// Authentication middleware
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const session = req.session as any;
  if (session && session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Schema for Google authentication
export const googleAuthSchema = z.object({
  firebaseId: z.string(),
  username: z.string(),
  email: z.string().email().optional(),
  photoURL: z.string().url().optional(),
});

// Schema for profile update
export const profileUpdateSchema = z.object({
  username: z.string().min(3),
  email: z.string().email().optional().nullable(),
});

// Authentication controller functions
export const authController = {
  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const session = req.session as any;
      const userId = session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const validatedData = profileUpdateSchema.parse(req.body);
      
      // Check if username is already taken by another user
      if (validatedData.username) {
        const existingUser = await storage.getUserByUsername(validatedData.username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Username is already taken" });
        }
      }
      
      // Update user profile
      const updatedUser = await storage.updateUser(userId, {
        username: validatedData.username,
        email: validatedData.email || null,
      });
      
      // Return updated user data
      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        photoURL: updatedUser.photoURL,
        firebaseId: updatedUser.firebaseId
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Server error during profile update" });
    }
  },
  // Google authentication/registration
  async googleAuth(req: Request, res: Response) {
    try {
      const validatedData = googleAuthSchema.parse(req.body);
      
      // Check if user with this firebaseId already exists
      let user = await storage.getUserByFirebaseId(validatedData.firebaseId);
      
      if (!user) {
        // Create a new user with the Google information
        user = await storage.createUser({
          username: validatedData.username,
          password: "", // No password for Google users
          firebaseId: validatedData.firebaseId,
          email: validatedData.email,
          photoURL: validatedData.photoURL,
        });
      }
      
      // Set user session
      const session = req.session as any;
      session.userId = user.id;
      
      // Return user data
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        photoURL: user.photoURL,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Google authentication error:", error);
      res.status(500).json({ message: "Server error during Google authentication" });
    }
  },
  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username is already taken
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
      
      // Create user with hashed password
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword,
      });
      
      // Set user session
      const session = req.session as any;
      session.userId = user.id;
      
      // Return user data (excluding password)
      res.status(201).json({
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  },
  
  // Login user
  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by username
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(validatedData.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }
      
      // Set user session
      const session = req.session as any;
      session.userId = user.id;
      
      // Return user data (excluding password)
      res.json({
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  },
  
  // Get current user
  async getCurrentUser(req: Request, res: Response) {
    try {
      const session = req.session as any;
      const userId = session.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  
  // Logout user
  async logout(req: Request, res: Response) {
    const session = req.session as any;
    session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  }
};