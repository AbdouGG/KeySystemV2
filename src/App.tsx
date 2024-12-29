import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Checkpoint } from './components/Checkpoint';
import { KeyDisplay } from './components/KeyDisplay';
import { generateKey } from './utils/keyGeneration';
import { getExistingValidKey } from './utils/keyManagement';
import { REDIRECT_PARAM } from './utils/linkvertiseHandler';
import type { CheckpointStatus, Key } from './types';

function App() {
  const [checkpoints, setCheckpoints] = useState<CheckpointStatus>({
    checkpoint1: false,
    checkpoint2: false,
    checkpoint3: false,
  });
  const [generatedKey, setGeneratedKey] = useState<Key | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle Linkvertise redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkpoint = params.get(REDIRECT_PARAM);

    if (checkpoint) {
      const checkpointKey = `checkpoint${checkpoint}` as keyof CheckpointStatus;
      handleCheckpointComplete(checkpointKey);

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Check for existing valid key on mount
  useEffect(() => {
    const checkExistingKey = async () => {
      try {
        const existingKey = await getExistingValidKey();
        if (existingKey) {
          setGeneratedKey(existingKey);
          setCheckpoints({
            checkpoint1: false,
            checkpoint2: false,
            checkpoint3: false,
          });
          localStorage.removeItem('checkpoints');
        }
      } catch (error) {
        console.error('Error checking existing key:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingKey();
  }, []);

  // Reset checkpoints on page load if no valid key exists
  useEffect(() => {
    if (!generatedKey) {
      const savedCheckpoints = localStorage.getItem('checkpoints');
      if (savedCheckpoints) {
        setCheckpoints(JSON.parse(savedCheckpoints));
      }
    }
  }, [generatedKey]);

  // Save checkpoints to localStorage when they change
  useEffect(() => {
    if (!generatedKey) {
      localStorage.setItem('checkpoints', JSON.stringify(checkpoints));
    }
  }, [checkpoints, generatedKey]);

  const handleCheckpointComplete = async (
    checkpoint: keyof CheckpointStatus
  ) => {
    // Verify sequential completion
    if (checkpoint === 'checkpoint2' && !checkpoints.checkpoint1) {
      setError('Please complete Checkpoint 1 first');
      return;
    }
    if (
      checkpoint === 'checkpoint3' &&
      (!checkpoints.checkpoint1 || !checkpoints.checkpoint2)
    ) {
      setError('Please complete previous checkpoints first');
      return;
    }

    setError(null);
    const newCheckpoints = { ...checkpoints, [checkpoint]: true };
    setCheckpoints(newCheckpoints);

    // If all checkpoints are complete, generate key
    if (Object.values(newCheckpoints).every((status) => status)) {
      try {
        const key = await generateKey();
        setGeneratedKey(key);
        localStorage.removeItem('checkpoints');
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Error generating key');
        }
        console.error('Error generating key:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-blue-500 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Key System</h1>
          <p className="text-gray-600">
            {generatedKey
              ? 'Your active key'
              : 'Complete all checkpoints to generate your key'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {!generatedKey ? (
          <div className="space-y-4">
            <Checkpoint
              number={1}
              completed={checkpoints.checkpoint1}
              onComplete={() => handleCheckpointComplete('checkpoint1')}
              disabled={false}
            />
            <Checkpoint
              number={2}
              completed={checkpoints.checkpoint2}
              onComplete={() => handleCheckpointComplete('checkpoint2')}
              disabled={!checkpoints.checkpoint1}
            />
            <Checkpoint
              number={3}
              completed={checkpoints.checkpoint3}
              onComplete={() => handleCheckpointComplete('checkpoint3')}
              disabled={!checkpoints.checkpoint2}
            />
          </div>
        ) : (
          <KeyDisplay keyData={generatedKey} />
        )}
      </div>
    </div>
  );
}

export default App;