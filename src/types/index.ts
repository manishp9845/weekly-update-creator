export interface RawMessage {
  id: string;
  content: string;
  timestamp: Date;
  weekOf: string; // YYYY-MM-DD format for the Monday of the week
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