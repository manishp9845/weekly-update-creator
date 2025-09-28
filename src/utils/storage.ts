import { RawMessage, GeneratedEmail } from '../types';

const STORAGE_KEYS = {
  RAW_MESSAGES: 'weekly-update-raw-messages',
  GENERATED_EMAILS: 'weekly-update-generated-emails',
  GEMINI_API_KEY: 'weekly-update-gemini-api-key',
};

export const saveRawMessages = (messages: RawMessage[]): void => {
  localStorage.setItem(STORAGE_KEYS.RAW_MESSAGES, JSON.stringify(messages));
};

export const loadRawMessages = (): RawMessage[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.RAW_MESSAGES);
  if (!stored) return [];
  
  const messages = JSON.parse(stored);
  return messages.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
  }));
};

export const saveGeneratedEmails = (emails: GeneratedEmail[]): void => {
  localStorage.setItem(STORAGE_KEYS.GENERATED_EMAILS, JSON.stringify(emails));
};

export const loadGeneratedEmails = (): GeneratedEmail[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.GENERATED_EMAILS);
  if (!stored) return [];
  
  const emails = JSON.parse(stored);
  return emails.map((email: any) => ({
    ...email,
    generatedAt: new Date(email.generatedAt),
  }));
};

export const saveGeminiApiKey = (apiKey: string): void => {
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
};

export const loadGeminiApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
};

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};