import { RawMessage, GeneratedEmail } from '../types';
import { indexedDbService } from '../services/indexedDbService';

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'weekly-update-gemini-api-key',
};

export const saveRawMessages = async (messages: RawMessage[]): Promise<void> => {
  await indexedDbService.clearRawMessages(); // Clear existing messages
  for (const message of messages) {
    await indexedDbService.addRawMessage(message);
  }
};

export const loadRawMessages = async (): Promise<RawMessage[]> => {
  return indexedDbService.getRawMessages();
};

export const saveGeneratedEmails = async (emails: GeneratedEmail[]): Promise<void> => {
  await indexedDbService.clearGeneratedEmails(); // Clear existing emails
  for (const email of emails) {
    await indexedDbService.addGeneratedEmail(email);
  }
};

export const loadGeneratedEmails = async (): Promise<GeneratedEmail[]> => {
  return indexedDbService.getGeneratedEmails();
};

export const saveGeminiApiKey = (apiKey: string): void => {
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
};

export const loadGeminiApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
};

export const clearAllData = async (): Promise<void> => {
  await indexedDbService.clearAllIndexedDbData();
  localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
};
