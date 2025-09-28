import React, { useState } from 'react';
import { Mail, Calendar, Copy, Trash2, Edit, Check, X } from 'lucide-react';
import { GeneratedEmail } from '../types';
import { formatWeekRange, formatMonthRange } from '../utils/dateUtils';
import { format } from 'date-fns';

interface EmailHistoryProps {
  emails: GeneratedEmail[];
  onDeleteEmail: (id: string) => void;
  onUpdateEmail: (email: GeneratedEmail) => void;
}

export const EmailHistory: React.FC<EmailHistoryProps> = ({
  emails,
  onDeleteEmail,
  onUpdateEmail,
}) => {
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSubject, setEditSubject] = useState('');

  const sortedEmails = emails.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());

  const handleCopyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleStartEdit = (email: GeneratedEmail) => {
    setEditingEmail(email.id);
    setEditSubject(email.subject);
    setEditContent(email.content);
  };

  const handleSaveEdit = () => {
    if (editingEmail) {
      const emailToUpdate = emails.find(e => e.id === editingEmail);
      if (emailToUpdate) {
        onUpdateEmail({
          ...emailToUpdate,
          subject: editSubject,
          content: editContent,
        });
      }
      setEditingEmail(null);
      setEditSubject('');
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingEmail(null);
    setEditSubject('');
    setEditContent('');
  };

  if (emails.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Email History</h3>
        <div className="text-center py-8 text-gray-500">
          No emails generated yet. Generate your first email to see it here!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Email History</h3>
      
      <div className="space-y-4">
        {sortedEmails.map(email => (
          <div key={email.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Mail className={`mr-2 ${email.type === 'weekly' ? 'text-blue-600' : 'text-green-600'}`} size={16} />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  email.type === 'weekly' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {email.type === 'weekly' ? 'Weekly' : 'Monthly'}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {email.type === 'weekly' && email.weekOf && formatWeekRange(email.weekOf)}
                  {email.type === 'monthly' && email.monthOf && formatMonthRange(email.monthOf)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyToClipboard(`Subject: ${email.subject}\n\n${email.content}`)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleStartEdit(email)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Edit email"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDeleteEmail(email.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete email"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {editingEmail === email.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={10}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <X className="mr-1" size={14} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    <Check className="mr-1" size={14} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <h4 className="font-medium text-gray-900">{email.subject}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="mr-1" size={14} />
                    Generated on {format(email.generatedAt, 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>

                <div className="mb-3">
                  <button
                    onClick={() => setExpandedEmail(expandedEmail === email.id ? null : email.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedEmail === email.id ? 'Hide Content' : 'Show Content'}
                  </button>
                </div>

                {expandedEmail === email.id && (
                  <div className="bg-gray-50 rounded-md p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                      {email.content}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};