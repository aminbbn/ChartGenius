import { User } from '../types';
import { dbPromise } from './db';

const SESSION_KEY = 'chartgenius_session_id';

export const AuthService = {
  // Now async because it checks the DB
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userId = localStorage.getItem(SESSION_KEY);
      if (!userId) return null;
      
      const db = await dbPromise;
      const user = await db.get('users', userId);
      return user || null;
    } catch (e) {
      console.error("Auth check failed", e);
      return null;
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    const db = await dbPromise;
    const userFromEmail = await db.getFromIndex('users', 'by-email', email);
    
    // Simple password check (in a real app, verify hash)
    if (!userFromEmail || userFromEmail.password !== password) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem(SESSION_KEY, userFromEmail.id);
    return userFromEmail;
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    const db = await dbPromise;
    
    // Check for existing user
    const existing = await db.getFromIndex('users', 'by-email', email);
    if (existing) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password
    };

    await db.add('users', newUser);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};