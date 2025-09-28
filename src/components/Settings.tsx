import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Save, Trash2, Eye, EyeOff } from 'lucide-react';

interface SettingsProps {
  apiKey: string | null;
  onApiKeyChange: (apiKey: string) => void;
  onClearAllData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  apiKey,
  onApiKeyChange,
  onClearAllData,
}) => {
  const [newApiKey, setNewApiKey] = useState(apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleSaveApiKey = () => {
    onApiKeyChange(newApiKey.trim());
  };

  const handleClearData = () => {
    onClearAllData();
    setShowConfirmClear(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <SettingsIcon className="mr-2" size={20} />
        Settings
      </h2>

      {/* API Key Configuration */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Key className="mr-2 text-blue-600" size={18} />
          Gemini API Configuration
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full p-3 pr-20 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-3 py-2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Get your API key from{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>

        <button
          onClick={handleSaveApiKey}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="mr-2" size={16} />
          Save API Key
        </button>

        {apiKey && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">
              ✓ API key is configured and ready to use
            </p>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Trash2 className="mr-2 text-red-600" size={18} />
          Data Management
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            This will permanently delete all your messages, generated emails, and settings.
            This action cannot be undone.
          </p>
          
          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
            >
              <Trash2 className="mr-2" size={16} />
              Clear All Data
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 font-medium mb-3">
                Are you sure you want to delete all data?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleClearData}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};