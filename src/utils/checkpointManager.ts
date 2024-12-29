import { clearVerifications } from './checkpointVerification';
import type { CheckpointStatus } from '../types';

export const resetCheckpoints = (): CheckpointStatus => {
  clearVerifications();
  return {
    checkpoint1: false,
    checkpoint2: false,
    checkpoint3: false,
  };
};