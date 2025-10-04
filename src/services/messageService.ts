import { RawMessage } from '../types';

const API_URL = 'http://localhost:3001'; // The backend server URL

export const getMessages = async (): Promise<RawMessage[]> => {
  const response = await fetch(`${API_URL}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  const data = await response.json();
  // The backend sends dates as strings, so we need to convert them back to Date objects
  return data.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }));
};

export const addMessage = async (message: Omit<RawMessage, '_id' | 'id' | 'timestamp' | 'weekOf'>): Promise<RawMessage> => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error('Failed to add message');
  }
  return response.json();
};

export const deleteMessage = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/messages/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete message');
  }
};