import React from 'react';
import { getCurrentCheckpoint } from '../utils/checkpointProgress';
import { createLinkvertiseUrl } from '../utils/linkvertiseHandler';
import { generateKey } from '../utils/keyGeneration';
import { Key } from '../types';

interface CheckpointButtonsProps {
  checkpoints: {
    checkpoint1: boolean;
    checkpoint2: boolean;
    checkpoint3: boolean;
  };
  onKeyGenerated: (key: Key) => void;
}

export const CheckpointButtons: React.FC<CheckpointButtonsProps> = ({
  checkpoints,
  onKeyGenerated,
}) => {
  const currentCheckpoint = getCurrentCheckpoint(checkpoints);
  const allCompleted = !currentCheckpoint;

  const handleLinkvertise = () => {
    if (!currentCheckpoint) return;
    const linkUrl = createLinkvertiseUrl(currentCheckpoint);
    window.open(linkUrl, '_blank');
  };

  const handleGenerateKey = async () => {
    try {
      const key = await generateKey();
      onKeyGenerated(key);
    } catch (error) {
      console.error('Failed to generate key:', error);
    }
  };

  if (allCompleted) {
    return (
      <button
        onClick={handleGenerateKey}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Generate Key
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleLinkvertise}
        className="w-full bg-[#ff8c00] hover:bg-[#ff7c00] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!currentCheckpoint}
      >
        Continue with Linkvertise
      </button>
      <button className="w-full bg-[#9146ff] hover:bg-[#8134ff] text-white font-medium py-3 px-4 rounded-lg transition-colors">
        Continue with Lootlabs
      </button>
    </div>
  );
};