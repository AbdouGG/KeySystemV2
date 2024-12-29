import React, { useState, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Checkpoint } from './components/Checkpoint';
import { KeyDisplay } from './components/KeyDisplay';
import { generateKey } from './utils/keyGeneration';
import { getExistingValidKey } from './utils/keyManagement';
import { REDIRECT_PARAM, validateCheckpoint } from './utils/linkvertiseHandler';
import { isCheckpointVerified } from './utils/checkpointVerification';
import type { CheckpointStatus, Key } from './types';

export default function App() {
  const [checkpoints, setCheckpoints] = useState<CheckpointStatus>({
    checkpoint1: false,
    checkpoint2: false,
    checkpoint3: false,
  });
  const [generatedKey, setGeneratedKey] = useState<Key | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  // Handle Linkvertise redirect and verify checkpoints
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkpointParam = params.get(REDIRECT_PARAM);
    const checkpointNumber = validateCheckpoint(checkpointParam);

    if (checkpointNumber) {
      const checkpointKey = `checkpoint${checkpointNumber}` as keyof CheckpointStatus;
      if (isCheckpointVerified(checkpointNumber)) {
        setCheckpoints((prev) => ({
          ...prev,
          [checkpointKey]: true,
        }));
      }

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Check for existing valid key and load verified checkpoints on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const existingKey = await getExistingValidKey();
        if (existingKey) {
          setGeneratedKey(existingKey);
        } else {
          const newCheckpoints = {
            checkpoint1: isCheckpointVerified(1),
            checkpoint2: isCheckpointVerified(2),
            checkpoint3: isCheckpointVerified(3),
          };
          setCheckpoints(newCheckpoints);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to load key system. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const onCaptchaVerify = (token: string) => {
    setCaptchaVerified(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-[#242424] rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-500 mb-2">Key system</h1>
            <p className="text-gray-400">
              Checkpoint: {Object.values(checkpoints).filter(Boolean).length} / 3
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!generatedKey && !captchaVerified && (
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <HCaptcha
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                  onVerify={onCaptchaVerify}
                  theme="dark"
                />
              </div>
            </div>
          )}

          {!generatedKey && captchaVerified && (
            <div className="space-y-4">
              <button
                className="w-full bg-[#ff8c00] hover:bg-[#ff7c00] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                onClick={() => window.open('https://linkvertise.com', '_blank')}
              >
                Continue with Linkvertise
              </button>
              <button
                className="w-full bg-[#9146ff] hover:bg-[#8134ff] text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Continue with Lootlabs
              </button>
            </div>
          )}

          {generatedKey && (
            <KeyDisplay keyData={generatedKey} />
          )}
        </div>
      </div>
    </div>
  );
}