import React, { useState, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { KeyDisplay } from './components/KeyDisplay';
import { CheckpointButtons } from './components/CheckpointButtons';
import { generateKey } from './utils/keyGeneration';
import { getExistingValidKey } from './utils/keyManagement';
import { REDIRECT_PARAM, validateCheckpoint } from './utils/linkvertiseHandler';
import { isCheckpointVerified } from './utils/checkpointVerification';
import { isKeyExpired, handleKeyExpiration } from './utils/keyExpiration';
import { getCheckpointProgress } from './utils/checkpointProgress';
import { Loader2 } from 'lucide-react';
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
  const [generating, setGenerating] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const allCheckpointsCompleted = Object.values(checkpoints).every(Boolean);

  // Handle Linkvertise redirect and verify checkpoints
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkpointParam = params.get(REDIRECT_PARAM);
    const checkpointNumber = validateCheckpoint(checkpointParam);

    if (checkpointNumber) {
      const checkpointKey =
        `checkpoint${checkpointNumber}` as keyof CheckpointStatus;
      setCheckpoints((prev) => ({
        ...prev,
        [checkpointKey]: true,
      }));

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Initialize app state
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const existingKey = await getExistingValidKey();

        if (existingKey) {
          if (isKeyExpired(existingKey.expires_at)) {
            handleKeyExpiration();
          } else {
            setGeneratedKey(existingKey);
          }
        }

        // Load checkpoint verifications
        const newCheckpoints = {
          checkpoint1: isCheckpointVerified(1),
          checkpoint2: isCheckpointVerified(2),
          checkpoint3: isCheckpointVerified(3),
        };
        setCheckpoints(newCheckpoints);
      } catch (error) {
        console.error('Error initializing app:', error);
        setError('Failed to load key system. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle key generation when all checkpoints are completed
  useEffect(() => {
    const generateKeyIfNeeded = async () => {
      if (allCheckpointsCompleted && !generatedKey && !generating) {
        setGenerating(true);
        try {
          const newKey = await generateKey();
          setGeneratedKey(newKey);
        } catch (error) {
          console.error('Error generating key:', error);
          setError('Failed to generate key. Please try again.');
        } finally {
          setGenerating(false);
        }
      }
    };

    generateKeyIfNeeded();
  }, [allCheckpointsCompleted, generatedKey, generating]);

  const onCaptchaVerify = () => {
    setCaptchaVerified(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
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
              Checkpoint: {getCheckpointProgress(checkpoints)} / 3
            </p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {generating && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Generating your key...</p>
            </div>
          )}

          {!generatedKey && !generating && (
            <>
              {!captchaVerified ? (
                <div className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <HCaptcha
                      sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                      onVerify={onCaptchaVerify}
                      theme="dark"
                    />
                  </div>
                </div>
              ) : (
                <CheckpointButtons checkpoints={checkpoints} />
              )}
            </>
          )}

          {generatedKey && <KeyDisplay keyData={generatedKey} />}
        </div>
      </div>
    </div>
  );
}
