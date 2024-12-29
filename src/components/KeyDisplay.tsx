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
    <div className="bg-[#2a2a2a] p-6 rounded-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-6 h-6 text-red-500" />
        <h2 className="text-xl font-bold text-red-500">Your Key is Ready!</h2>
      </div>
      
      <div className="bg-[#1a1a1a] p-4 rounded-md flex items-center justify-between mb-4">
        <code className="font-mono text-sm text-gray-300">{keyData.key}</code>
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-[#242424] rounded-full transition-colors"
        >
          <Copy className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Expires in: {formatDistanceToNow(new Date(keyData.expires_at))}
      </p>
    </div>
  );
};