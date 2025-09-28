import React, { useState } from 'react';
import { Mail, Calendar, Loader2, Sparkles } from 'lucide-react';
import { RawMessage, GeneratedEmail } from '../types';
import { GeminiService } from '../services/geminiService';
import { getCurrentWeek, getCurrentMonth, formatWeekRange } from '../utils/dateUtils';

interface EmailGeneratorProps {
  messages: RawMessage[];
  generatedEmails: GeneratedEmail[];
  onEmailGenerated: (email: GeneratedEmail) => void;
  geminiApiKey: string | null;
}

export const EmailGenerator: React.FC<EmailGeneratorProps> = ({
  messages,
  generatedEmails,
  onEmailGenerated,
  geminiApiKey,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [error, setError] = useState<string | null>(null);

  const currentMonth = getCurrentMonth();
  
  // Get unique weeks from messages
  const availableWeeks = Array.from(
    new Set(messages.map(msg => msg.weekOf))
  ).sort().reverse();

  // Get weekly emails for current month
  const currentMonthWeeklyEmails = generatedEmails.filter(
    email => email.type === 'weekly' && 
    email.weekOf && 
    email.weekOf.startsWith(currentMonth.replace('-', '-'))
  );

  const messagesForSelectedWeek = messages.filter(msg => msg.weekOf === selectedWeek);

  const handleGenerateWeekly = async () => {
    console.log('API Key available:', !!geminiApiKey);
    console.log('API Key length:', geminiApiKey?.length);
    console.log('Messages for week:', messagesForSelectedWeek.length);
    
    if (!geminiApiKey) {
      setError('Please configure your Gemini API key first.');
      return;
    }

    if (messagesForSelectedWeek.length === 0) {
      setError('No messages found for the selected week.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('Creating Gemini service...');
      const geminiService = new GeminiService(geminiApiKey);
      console.log('Calling generateWeeklyEmail...');
      const result = await geminiService.generateWeeklyEmail(messagesForSelectedWeek, selectedWeek);
      
      const newEmail: GeneratedEmail = {
        id: Date.now().toString(),
        type: 'weekly',
        subject: result.subject,
        content: result.content,
        generatedAt: new Date(),
        weekOf: selectedWeek,
        rawMessageIds: messagesForSelectedWeek.map(msg => msg.id),
      };

      onEmailGenerated(newEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMonthly = async () => {
    if (!geminiApiKey) {
      setError('Please configure your Gemini API key first.');
      return;
    }

    if (currentMonthWeeklyEmails.length === 0) {
      setError('No weekly emails found for the current month.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const geminiService = new GeminiService(geminiApiKey);
      const result = await geminiService.generateMonthlyEmail(currentMonthWeeklyEmails, currentMonth);
      
      const newEmail: GeneratedEmail = {
        id: Date.now().toString(),
        type: 'monthly',
        subject: result.subject,
        content: result.content,
        generatedAt: new Date(),
        monthOf: currentMonth,
        rawMessageIds: currentMonthWeeklyEmails.flatMap(email => email.rawMessageIds),
      };

      onEmailGenerated(newEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate monthly email');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Sparkles className="mr-2 text-purple-600" size={20} />
        Generate Email Updates
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {!geminiApiKey && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-4">
          Please configure your Gemini API key in the settings to generate emails.
        </div>
      )}

      {/* Weekly Email Generation */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Calendar className="mr-2 text-blue-600" size={18} />
          Weekly Update
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Week
          </label>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableWeeks.map(week => (
              <option key={week} value={week}>
                {formatWeekRange(week)} ({messages.filter(msg => msg.weekOf === week).length} messages)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {messagesForSelectedWeek.length} message{messagesForSelectedWeek.length !== 1 ? 's' : ''} for selected week
          </div>
          <button
            onClick={handleGenerateWeekly}
            disabled={isGenerating || !geminiApiKey || messagesForSelectedWeek.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 animate-spin" size={16} />
            ) : (
              <Mail className="mr-2" size={16} />
            )}
            Generate Weekly Email
          </button>
        </div>
      </div>

      {/* Monthly Email Generation */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Calendar className="mr-2 text-green-600" size={18} />
          Monthly Update
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {currentMonthWeeklyEmails.length} weekly email{currentMonthWeeklyEmails.length !== 1 ? 's' : ''} for {currentMonth}
          </div>
          <button
            onClick={handleGenerateMonthly}
            disabled={isGenerating || !geminiApiKey || currentMonthWeeklyEmails.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 animate-spin" size={16} />
            ) : (
              <Mail className="mr-2" size={16} />
            )}
            Generate Monthly Email
          </button>
        </div>
      </div>
    </div>
  );
};