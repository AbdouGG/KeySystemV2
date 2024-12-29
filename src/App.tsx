import React, { useState, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Checkpoint } from './components/Checkpoint';
import { KeyDisplay } from './components/KeyDisplay';
import { generateKey } from './utils/keyGeneration';
import { getExistingValidKey } from './utils/keyManagement';
import { REDIRECT_PARAM, validateCheckpoint } from './utils/linkvertiseHandler';
import { isCheckpointVerified } from './utils/checkpointVerification';
import { isKeyExpired, handleKeyExpiration } from './utils/keyExpiration';
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

  // Previous useEffect hooks remain the same...

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
              Checkpoint: {Object.values(checkpoints).filter(Boolean).length} / 3
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
                <div className="space-y-4">
                  <Checkpoint
                    number={1}
                    completed={checkpoints.checkpoint1}
                    onComplete={() => {}}
                    disabled={false}
                  />
                  <Checkpoint
                    number={2}
                    completed={checkpoints.checkpoint2}
                    onComplete={() => {}}
                    disabled={!checkpoints.checkpoint1}
                  />
                  <Checkpoint
                    number={3}
                    completed={checkpoints.checkpoint3}
                    onComplete={() => {}}
                    disabled={!checkpoints.checkpoint2}
                  />
                </div>
              )}
            </>
          )}

          {generatedKey && <KeyDisplay keyData={generatedKey} />}

          {allCheckpointsCompleted && !generatedKey && !generating && (
            <div className="mt-6 text-center">
              <p className="text-green-400 mb-2">
                All checkpoints completed! Your key is being generated...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}