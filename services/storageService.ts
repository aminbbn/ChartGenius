import { SavedDocument, ContentBlock } from '../types';
import { dbPromise } from './db';

const SESSION_KEY = 'chartgenius_session_id';

// Helper to detect direction
export const detectDirection = (text: string): 'ltr' | 'rtl' => {
  const rtlRegex = /[\u0600-\u06FF]/;
  return rtlRegex.test(text) ? 'rtl' : 'ltr';
};

export const saveDocument = async (originalText: string, blocks: ContentBlock[]): Promise<SavedDocument> => {
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) throw new Error("User must be logged in to save documents");

  // Extract title
  const firstTextBlock = blocks.find(b => b.type === 'text');
  let title = "Untitled Report";
  let excerpt = "No content preview available.";
  
  if (firstTextBlock && firstTextBlock.content) {
    const lines = firstTextBlock.content.split('\n');
    const potentialTitle = lines.find(l => l.length > 5 && l.length < 100);
    title = potentialTitle ? potentialTitle.trim() : "Analysis Report";
    excerpt = firstTextBlock.content.substring(0, 150) + "...";
  }

  const chartCount = blocks.filter(b => b.type === 'chart').length;
  const direction = detectDirection(originalText);

  const newDoc: SavedDocument = {
    id: crypto.randomUUID(),
    userId: userId,
    title,
    excerpt,
    createdAt: Date.now(),
    blocks,
    originalText,
    chartCount,
    direction
  };

  const db = await dbPromise;
  await db.add('documents', newDoc);
  
  return newDoc;
};

export const getDocuments = async (): Promise<SavedDocument[]> => {
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) return [];

  const db = await dbPromise;
  const docs = await db.getAllFromIndex('documents', 'by-user', userId);
  // Sort by created desc (newest first)
  return docs.sort((a, b) => b.createdAt - a.createdAt);
};

export const getDocument = async (id: string): Promise<SavedDocument | undefined> => {
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) return undefined;

  const db = await dbPromise;
  const doc = await db.get('documents', id);
  
  // Security check: ensure doc belongs to current user
  if (doc && doc.userId === userId) {
    return doc;
  }
  return undefined;
};

export const deleteDocument = async (id: string): Promise<void> => {
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) return;

  const db = await dbPromise;
  const doc = await db.get('documents', id);
  
  if (doc && doc.userId === userId) {
    await db.delete('documents', id);
  }
};