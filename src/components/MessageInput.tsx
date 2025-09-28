import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { RawMessage } from '../types';
import { getCurrentWeek } from '../utils/dateUtils';

interface MessageInputProps {
  onAddMessage: (message: RawMessage) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onAddMessage }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const newMessage: RawMessage = {
        id: Date.now().toString(),
        content: content.trim(),
        timestamp: new Date(),
        weekOf: getCurrentWeek(),
      };
      onAddMessage(newMessage);
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Plus className="mr-2" size={20} />
        Add New Message
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Paste your raw messages, notes, or updates here..."
            className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all ${
              isExpanded ? 'h-32' : 'h-20'
            }`}
            rows={isExpanded ? 8 : 3}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Will be added to week of {getCurrentWeek()}
          </span>
          <button
            type="submit"
            disabled={!content.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="mr-2" size={16} />
            Save Message
          </button>
        </div>
      </form>
    </div>
  );
};