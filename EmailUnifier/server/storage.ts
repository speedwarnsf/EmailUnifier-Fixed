import { users, type User, type InsertUser, type ApproveUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  approveUser(id: number, approvalData: ApproveUser): Promise<User | undefined>;
  getPendingUsers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      isApproved: false,
      approvedBy: null,
      createdAt: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  async approveUser(id: number, approvalData: ApproveUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...approvalData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPendingUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => !user.isApproved);
  }
}

export const storage = new MemStorage();

// Auto-approve the first admin user for initial setup
setTimeout(async () => {
  const adminUser = await storage.getUserByEmail("admin@socialmarketing.com");
  if (adminUser && !adminUser.isApproved) {
    await storage.approveUser(adminUser.id, {
      isApproved: true,
      approvedBy: "system"
    });
    console.log("Admin user auto-approved for initial setup");
  }
}, 1000);
