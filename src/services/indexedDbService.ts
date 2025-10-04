import { openDB, IDBPDatabase } from 'idb';
import { RawMessage, GeneratedEmail } from '../types';

const DB_NAME = 'weekly-update-db';
const DB_VERSION = 1; // Increment this version number if you change the schema
const STORE_NAMES = {
  RAW_MESSAGES: 'rawMessages',
  GENERATED_EMAILS: 'generatedEmails',
};

let db: IDBPDatabase | null = null;

async function initDB(): Promise<IDBPDatabase> {
  if (db) {
    return db;
  }
  try {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (oldVersion < 1) {
          db.createObjectStore(STORE_NAMES.RAW_MESSAGES, { keyPath: 'id' });
          db.createObjectStore(STORE_NAMES.GENERATED_EMAILS, { keyPath: 'id' });
        }
      },
      blocked() {
        console.error('IndexedDB: Database upgrade blocked. Close other tabs with this app.');
      },
      blocking() {
        console.warn('IndexedDB: Old database connection blocking upgrade. Close other tabs.');
      }
    });
    return db;
  } catch (error) {
    console.error('IndexedDB: Error opening or upgrading database:', error);
    throw error;
  }
}

export const indexedDbService = {
  // Raw Messages Operations
  async addRawMessage(message: RawMessage): Promise<void> {
    const db = await initDB();
    try {
      await db.add(STORE_NAMES.RAW_MESSAGES, message);
    } catch (error) {
      console.error('IndexedDB: Error adding raw message:', error);
      throw error;
    }
  },

  async getRawMessages(): Promise<RawMessage[]> {
    const db = await initDB();
    const messages = await db.getAll(STORE_NAMES.RAW_MESSAGES);
    const parsedMessages = messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    return parsedMessages;
  },

  async deleteRawMessage(id: string): Promise<void> {
    const db = await initDB();
    await db.delete(STORE_NAMES.RAW_MESSAGES, id);
  },

  async clearRawMessages(): Promise<void> {
    const db = await initDB();
    await db.clear(STORE_NAMES.RAW_MESSAGES);
  },

  // Generated Emails Operations
  async addGeneratedEmail(email: GeneratedEmail): Promise<void> {
    const db = await initDB();
    await db.add(STORE_NAMES.GENERATED_EMAILS, email);
  },

  async getGeneratedEmails(): Promise<GeneratedEmail[]> {
    const db = await initDB();
    return db.getAll(STORE_NAMES.GENERATED_EMAILS);
  },

  async updateGeneratedEmail(email: GeneratedEmail): Promise<void> {
    const db = await initDB();
    await db.put(STORE_NAMES.GENERATED_EMAILS, email);
  },

  async deleteGeneratedEmail(id: string): Promise<void> {
    const db = await initDB();
    await db.delete(STORE_NAMES.RAW_MESSAGES, id);
  },

  async clearGeneratedEmails(): Promise<void> {
    const db = await initDB();
    await db.clear(STORE_NAMES.GENERATED_EMAILS);
  },

  async clearAllIndexedDbData(): Promise<void> {
    const db = await initDB();
    await db.clear(STORE_NAMES.RAW_MESSAGES);
    await db.clear(STORE_NAMES.GENERATED_EMAILS);
  }
};
