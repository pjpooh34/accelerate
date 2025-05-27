import { users, type User, type InsertUser, type Content, type InsertContent } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  
  // Subscription management methods
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, data: { customerId: string; subscriptionId: string }): Promise<User>;
  updateSubscriptionStatus(userId: number, status: string, endDate?: Date): Promise<User>;
  updateUserPreferences(userId: number, preferences: { preferredAiModel?: string }): Promise<User>;
  incrementAiUsage(userId: number): Promise<User>;
  resetAiUsage(userId: number): Promise<User>;
  
  // Content related methods
  createContent(content: InsertContent): Promise<number>;
  getAllContent(): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  getUserContent(userId: number): Promise<Content[]>;
  saveContent(userId: number, contentId: number): Promise<void>;
  unsaveContent(userId: number, contentId: number): Promise<void>;
  getSavedContent(userId: number): Promise<Content[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contents: Map<number, Content>;
  private savedContents: Map<string, { userId: number; contentId: number; savedAt: Date }>;
  private userCurrentId: number;
  private contentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contents = new Map();
    this.savedContents = new Map();
    this.userCurrentId = 1;
    this.contentCurrentId = 1;
    
    // Create default test users for development
    this.initializeTestUsers();
  }

  private async initializeTestUsers() {
    const bcrypt = await import('bcryptjs');
    
    // Create test user "pete" with password "password123"
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser: User = {
      id: 1,
      username: 'pete',
      password: hashedPassword,
      email: 'pete@test.com',
      firebaseId: null,
      photoURL: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      subscriptionEndDate: null,
      preferredAiModel: 'openai',
      aiUsageCount: 0,
      aiUsageResetDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(1, testUser);
    this.userCurrentId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseId === firebaseId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    // Convert undefined to null for storage
    const user: User = { 
      ...insertUser, 
      id,
      firebaseId: insertUser.firebaseId || null,
      email: insertUser.email || null,
      photoURL: insertUser.photoURL || null,
      // Initialize subscription fields
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "free",
      subscriptionEndDate: null,
      // Initialize AI model preferences
      preferredAiModel: "openai",
      aiUsageCount: 0,
      aiUsageResetDate: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Update user data
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  

  
  async saveContent(userId: number, contentId: number): Promise<void> {
    // Check if user exists
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if content exists
    const content = await this.getContent(contentId);
    if (!content) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    
    // Create a unique key for this saved content
    const key = `${userId}-${contentId}`;
    
    // Save the content as favorite
    this.savedContents.set(key, {
      userId,
      contentId,
      savedAt: new Date(),
    });
  }
  
  async unsaveContent(userId: number, contentId: number): Promise<void> {
    // Create the key for this saved content
    const key = `${userId}-${contentId}`;
    
    // Check if this content was saved by this user
    if (!this.savedContents.has(key)) {
      throw new Error(`Content with ID ${contentId} was not saved by user ${userId}`);
    }
    
    // Remove from favorites
    this.savedContents.delete(key);
  }
  
  async getSavedContent(userId: number): Promise<Content[]> {
    // Find all saved content for this user
    const savedIds = Array.from(this.savedContents.entries())
      .filter(([_, saved]) => saved.userId === userId)
      .map(([_, saved]) => saved.contentId);
    
    // Get the actual content items
    const savedContent: Content[] = [];
    for (const id of savedIds) {
      const content = await this.getContent(id);
      if (content) {
        savedContent.push(content);
      }
    }
    
    // Sort by most recently saved
    return savedContent.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async createContent(insertContent: InsertContent): Promise<number> {
    const id = this.contentCurrentId++;
    const content: Content = { 
      ...insertContent, 
      id, 
      userId: insertContent.userId || null, 
      createdAt: new Date(),
      category: insertContent.category || null
    };
    this.contents.set(id, content);
    return id;
  }
  
  async getAllContent(): Promise<Content[]> {
    return Array.from(this.contents.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }
  
  async getUserContent(userId: number): Promise<Content[]> {
    return Array.from(this.contents.values())
      .filter(content => content.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Subscription management method implementations
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, stripeCustomerId: customerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(userId: number, data: { customerId: string; subscriptionId: string }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { 
      ...user, 
      stripeCustomerId: data.customerId,
      stripeSubscriptionId: data.subscriptionId,
      subscriptionStatus: "active"
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateSubscriptionStatus(userId: number, status: string, endDate?: Date): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { 
      ...user, 
      subscriptionStatus: status,
      subscriptionEndDate: endDate || null
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserPreferences(userId: number, preferences: { preferredAiModel?: string }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { 
      ...user, 
      preferredAiModel: preferences.preferredAiModel || user.preferredAiModel
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async incrementAiUsage(userId: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { 
      ...user, 
      aiUsageCount: (user.aiUsageCount || 0) + 1
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async resetAiUsage(userId: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { 
      ...user, 
      aiUsageCount: 0,
      aiUsageResetDate: new Date()
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
