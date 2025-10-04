export type MessageTag = 'win' | 'challenge' | 'never settle' | 'upcoming';

export interface RawMessage {
  _id?: string; // from MongoDB
  id?: string; // from frontend before saving
  content: string;
  tag: MessageTag;
  timestamp: Date;
  weekOf: string; // YYYY-MM-DD format for the Monday of the week
  userId?: string; // The user who created it
}

export interface GeneratedEmail {
  id: string;
  type: 'weekly' | 'monthly';
  subject: string;
  content: string;
  generatedAt: Date;
  weekOf?: string; // For weekly emails
  monthOf?: string; // For monthly emails (YYYY-MM format)
  rawMessageIds: string[]; // IDs of raw messages used to generate this email
}

export interface EmailSection {
  wins: string[];
  challenges: string[];
  neverSettles: string[];
  upcoming: string[];
  additional?: string;
}

export interface WeeklyUpdateData {
  weekOf: string;
  messages: RawMessage[];
  sections: EmailSection;
}