import React from 'react';
import { Key, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface KeyDisplayProps {
  keyData: {
    key: string;
    expires_at: string;
  };
}

export const KeyDisplay: React.FC<KeyDisplayProps> = ({ keyData }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(keyData.key);
  };

  return (
    <div className="bg-green-100 p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-green-800">Your Key is Ready!</h2>
      </div>
      
      <div className="bg-white p-4 rounded-md flex items-center justify-between mb-4">
        <code className="font-mono text-sm">{keyData.key}</code>
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Copy className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <p className="text-sm text-green-700">
        Expires in: {formatDistanceToNow(new Date(keyData.expires_at))}
      </p>
    </div>
  );
};