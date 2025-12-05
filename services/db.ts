import { openDB, DBSchema } from 'idb';
import { User, SavedDocument } from '../types';

interface ChartGeniusDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
  documents: {
    key: string;
    value: SavedDocument;
    indexes: { 'by-user': string; 'by-date': number };
  };
}

const DB_NAME = 'chartgenius-db';
const DB_VERSION = 1;

export const dbPromise = openDB<ChartGeniusDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // User Store
    const userStore = db.createObjectStore('users', { keyPath: 'id' });
    userStore.createIndex('by-email', 'email', { unique: true });

    // Document Store
    const docStore = db.createObjectStore('documents', { keyPath: 'id' });
    docStore.createIndex('by-user', 'userId');
    docStore.createIndex('by-date', 'createdAt');
  },
});

export const clearDatabase = async () => {
    const db = await dbPromise;
    await db.clear('users');
    await db.clear('documents');
};