import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, History, Settings as SettingsIcon } from 'lucide-react';
import { MessageInput } from './components/MessageInput';
import { MessageList } from './components/MessageList';
import { EmailGenerator } from './components/EmailGenerator';
import { EmailHistory } from './components/EmailHistory';
import { Settings } from './components/Settings';
import { RawMessage, GeneratedEmail } from './types';
import {
  saveRawMessages,
  loadRawMessages,
  saveGeneratedEmails,
  loadGeneratedEmails,
  saveGeminiApiKey,
  loadGeminiApiKey,
  clearAllData,
} from './utils/storage';
import './App.css';

type TabType = 'messages' | 'generate' | 'history' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  console.log('App.tsx: Current activeTab:', activeTab);
  const [messages, setMessages] = useState<RawMessage[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const loadedMessages = await loadRawMessages();
        setMessages(loadedMessages);

        const loadedEmails = await loadGeneratedEmails();
        setGeneratedEmails(loadedEmails);

        setGeminiApiKey(loadGeminiApiKey());
      } catch (error) {
        console.error('App.tsx: Error loading initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  // Save messages when they change
  useEffect(() => {
    const saveMessages = async () => {
      await saveRawMessages(messages);
    };
    saveMessages();
  }, [messages]);

  // Save emails when they change
  useEffect(() => {
    const saveEmails = async () => {
      await saveGeneratedEmails(generatedEmails);
    };
    saveEmails();
  }, [generatedEmails]);

  const handleAddMessage = (message: RawMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleEmailGenerated = (email: GeneratedEmail) => {
    setGeneratedEmails(prev => [...prev, email]);
    setActiveTab('history');
  };

  const handleDeleteEmail = (id: string) => {
    setGeneratedEmails(prev => prev.filter(email => email.id !== id));
  };

  const handleUpdateEmail = (updatedEmail: GeneratedEmail) => {
    setGeneratedEmails(prev =>
      prev.map(email => email.id === updatedEmail.id ? updatedEmail : email)
    );
  };

  const handleApiKeyChange = (apiKey: string) => {
    setGeminiApiKey(apiKey);
    saveGeminiApiKey(apiKey);
  };

  const handleClearAllData = () => {
    clearAllData();
    setMessages([]);
    setGeneratedEmails([]);
    setGeminiApiKey(null);
  };

  const tabs = [
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
    { id: 'generate' as TabType, label: 'Generate', icon: Mail },
    { id: 'history' as TabType, label: 'History', icon: History },
    { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Weekly Update Generator
          </h1>
          <p className="text-gray-600">
            Collect your weekly messages and generate professional update emails using AI
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-2" size={16} />
                  {tab.label}
                  {tab.id === 'messages' && messages.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {messages.length}
                    </span>
                  )}
                  {tab.id === 'history' && generatedEmails.length > 0 && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {generatedEmails.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'messages' && (
            <>
              <MessageInput onAddMessage={handleAddMessage} />
              <MessageList
                messages={messages}
                onDeleteMessage={handleDeleteMessage}
              />
            </>
          )}

          {activeTab === 'generate' && (
            <EmailGenerator
              messages={messages}
              generatedEmails={generatedEmails}
              onEmailGenerated={handleEmailGenerated}
              geminiApiKey={geminiApiKey}
            />
          )}

          {activeTab === 'history' && (
            <EmailHistory
              emails={generatedEmails}
              onDeleteEmail={handleDeleteEmail}
              onUpdateEmail={handleUpdateEmail}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              apiKey={geminiApiKey}
              onApiKeyChange={handleApiKeyChange}
              onClearAllData={handleClearAllData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
