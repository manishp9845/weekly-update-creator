import React from 'react';
import { Trash2, Clock, Tag } from 'lucide-react';
import { RawMessage, MessageTag } from '../types';
import { format } from 'date-fns';

interface MessageListProps {
  messages: RawMessage[];
  onDeleteMessage: (id: string) => void;
}

const tagColorMap: Record<MessageTag, string> = {
    win: 'bg-green-100 text-green-800',
    challenge: 'bg-red-100 text-red-800',
    'never settle': 'bg-yellow-100 text-yellow-800',
    upcoming: 'bg-blue-100 text-blue-800',
};

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onDeleteMessage,
}) => {
  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Messages</h3>
        <div className="text-center py-8 text-gray-500">
          No messages yet. Add some messages to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Messages</h3>
      <div className="space-y-4">
        {messages.map(message => (
          <div key={message._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Tag className="text-gray-400" size={16} />
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${tagColorMap[message.tag]}`}>
                  {message.tag.charAt(0).toUpperCase() + message.tag.slice(1)}
                </span>
              </div>
              <button
                onClick={() => {
                  if (message._id) {
                    onDeleteMessage(message._id);
                  }
                }}
                className="text-red-500 hover:text-red-700 p-1 transition-colors"
                title="Delete message"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="text-gray-800 whitespace-pre-wrap mb-3">
              {message.content}
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1.5" size={14} />
              {format(new Date(message.timestamp), 'MMM dd, yyyy HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};