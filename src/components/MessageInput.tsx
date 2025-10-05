import React, { useState } from 'react';
import { Plus, Save, Tag } from 'lucide-react';
import { RawMessage, MessageTag } from '../types';
import { getCurrentWeek } from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';

interface MessageInputProps {
  onAddMessage: (message: Omit<RawMessage, 'id' | 'timestamp' | 'weekOf'>) => void;
}

const tags: MessageTag[] = ['win', 'challenge', 'never settle', 'upcoming'];

export const MessageInput: React.FC<MessageInputProps> = ({ onAddMessage }) => {
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<MessageTag>('win');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        // This should ideally be handled more gracefully
        alert('You must be logged in to add a message.');
        return;
      }

      const newMessage = {
        _id: uuidv4(),
        content: content.trim(),
        tag: selectedTag,
        userId,
      };
      onAddMessage(newMessage);
      setContent('');
      setSelectedTag('win');
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

        <div className="mb-4">
            <label htmlFor="message-tag" className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline-block mr-2" size={16} />
                Tag this message
            </label>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <button
                        type="button"
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedTag === tag
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </button>
                ))}
            </div>
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