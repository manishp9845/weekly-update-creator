import { GoogleGenerativeAI } from '@google/generative-ai';
import { RawMessage, GeneratedEmail, EmailSection } from '../types';
import { formatWeekRange, formatMonthRange } from '../utils/dateUtils';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.initializeAPI(apiKey);
    }
  }

  initializeAPI(apiKey: string): void {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }

  private createWeeklyPrompt(messages: RawMessage[], weekOf: string): string {
    const weekRange = formatWeekRange(weekOf);
    const messagesText = messages.map(msg => msg.content).join('\n\n---\n\n');

    return `
You are an AI assistant helping to generate a professional weekly update email. 

Based on the following raw messages and notes from the week of ${weekRange}, please generate a structured weekly update email with the following sections:

**WINS**: Key achievements, successes, and positive outcomes from the week
**CHALLENGES**: Difficulties faced, obstacles encountered, or problems that needed solving
**NEVER SETTLES**: Areas where continuous improvement efforts were made, learning opportunities, or initiatives for excellence
**UPCOMING**: Plans, goals, or important items for the following week

Raw messages and notes:
${messagesText}

Please format the response as a professional email with:
1. A clear subject line
2. Well-organized sections with bullet points
3. Professional but friendly tone
4. Concise but informative content

Return the response in the following JSON format:
{
  "subject": "Weekly Update - [Week Range]",
  "content": "Full email content with proper formatting",
  "sections": {
    "wins": ["win 1", "win 2", ...],
    "challenges": ["challenge 1", "challenge 2", ...],
    "neverSettles": ["improvement 1", "improvement 2", ...],
    "upcoming": ["upcoming item 1", "upcoming item 2", ...]
  }
}
`;
  }

  private createMonthlyPrompt(weeklyEmails: GeneratedEmail[], monthOf: string): string {
    const monthRange = formatMonthRange(monthOf);
    const weeklyContents = weeklyEmails.map((email, index) => 
      `Week ${index + 1} (${email.weekOf ? formatWeekRange(email.weekOf) : 'Unknown'}):\n${email.content}`
    ).join('\n\n---\n\n');

    return `
You are an AI assistant helping to generate a comprehensive monthly update email.

Based on the following weekly update emails from ${monthRange}, please generate a consolidated monthly update that summarizes the entire month's activities.

Weekly updates:
${weeklyContents}

Please create a monthly summary that:
1. Consolidates major wins and achievements across all weeks
2. Summarizes key challenges and how they were addressed
3. Highlights continuous improvement efforts and learning
4. Outlines major upcoming initiatives for the next month
5. Provides a high-level overview of the month's progress

Return the response in the following JSON format:
{
  "subject": "Monthly Update - [Month Year]",
  "content": "Full monthly email content with proper formatting",
  "sections": {
    "wins": ["consolidated win 1", "consolidated win 2", ...],
    "challenges": ["major challenge 1", "major challenge 2", ...],
    "neverSettles": ["improvement theme 1", "improvement theme 2", ...],
    "upcoming": ["major upcoming item 1", "major upcoming item 2", ...]
  }
}
`;
  }

  async generateWeeklyEmail(messages: RawMessage[], weekOf: string): Promise<{ subject: string; content: string; sections: EmailSection }> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please provide an API key.');
    }

    const prompt = this.createWeeklyPrompt(messages, weekOf);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          subject: parsed.subject || `Weekly Update - ${formatWeekRange(weekOf)}`,
          content: parsed.content || text,
          sections: parsed.sections || {
            wins: [],
            challenges: [],
            neverSettles: [],
            upcoming: []
          }
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        subject: `Weekly Update - ${formatWeekRange(weekOf)}`,
        content: text,
        sections: {
          wins: [],
          challenges: [],
          neverSettles: [],
          upcoming: []
        }
      };
    } catch (error) {
      console.error('Error generating weekly email:', error);
      throw new Error('Failed to generate weekly email. Please check your API key and try again.');
    }
  }

  async generateMonthlyEmail(weeklyEmails: GeneratedEmail[], monthOf: string): Promise<{ subject: string; content: string; sections: EmailSection }> {
    if (!this.model) {
      throw new Error('Gemini API not initialized. Please provide an API key.');
    }

    const prompt = this.createMonthlyPrompt(weeklyEmails, monthOf);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          subject: parsed.subject || `Monthly Update - ${formatMonthRange(monthOf)}`,
          content: parsed.content || text,
          sections: parsed.sections || {
            wins: [],
            challenges: [],
            neverSettles: [],
            upcoming: []
          }
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        subject: `Monthly Update - ${formatMonthRange(monthOf)}`,
        content: text,
        sections: {
          wins: [],
          challenges: [],
          neverSettles: [],
          upcoming: []
        }
      };
    } catch (error) {
      console.error('Error generating monthly email:', error);
      throw new Error('Failed to generate monthly email. Please check your API key and try again.');
    }
  }
}