import React from 'react';
import { Trash2, Calendar, Clock } from 'lucide-react';
import { RawMessage } from '../types';
import { formatWeekRange } from '../utils/dateUtils';
import { format } from 'date-fns';

interface MessageListProps {
  messages: RawMessage[];
  onDeleteMessage: (id: string) => void;
  selectedWeek?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onDeleteMessage,
  selectedWeek
}) => {
  console.log('MessageList.tsx: Messages prop on render:', messages);
  // Temporarily display raw messages prop (Debug)
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Raw Messages Prop (Debug)</h3>
      <pre className="whitespace-pre-wrap text-sm">
        {JSON.stringify(messages, null, 2)}
      </pre>
    </div>
  );

  /* Original rendering logic commented out
  const filteredMessages = selectedWeek
    ? messages.filter(msg => msg.weekOf === selectedWeek)
    : messages;

  const groupedMessages = filteredMessages.reduce((groups, message) => {
    const week = message.weekOf;
    if (!groups[week]) {
      groups[week] = [];
    }
    groups[week].push(message);
    return groups;
  }, {} as Record<string, RawMessage[]>);

  const sortedWeeks = Object.keys(groupedMessages).sort().reverse();

  if (filteredMessages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Messages</h3>
        <div className="text-center py-8 text-gray-500">
          {selectedWeek
            ? `No messages found for week of ${formatWeekRange(selectedWeek)}`
            : 'No messages yet. Add some messages to get started!'
          }
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        Messages {selectedWeek && `- ${formatWeekRange(selectedWeek)}`}
      </h3>

      <div className="space-y-6">
        {sortedWeeks.map(week => (
          <div key={week} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-center mb-3">
              <Calendar className="mr-2 text-blue-600" size={16} />
              <h4 className="font-medium text-gray-700">
                Week of {formatWeekRange(week)}
              </h4>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {groupedMessages[week].length} message{groupedMessages[week].length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {groupedMessages[week]
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map(message => (
                <div key={message.id} className="bg-gray-50 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1" size={14} />
                      {format(message.timestamp, 'MMM dd, yyyy HH:mm')}
                    </div>
                    <button
                      onClick={() => onDeleteMessage(message.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  */
};