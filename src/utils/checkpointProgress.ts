import type { CheckpointStatus } from '../types';

export const getCurrentCheckpoint = (
  checkpoints: CheckpointStatus
): number | null => {
  if (!checkpoints.checkpoint1) return 1;
  if (!checkpoints.checkpoint2) return 2;
  if (!checkpoints.checkpoint3) return 3;
  return null;
};

export const getCheckpointProgress = (
  checkpoints: CheckpointStatus
): number => {
  return Object.values(checkpoints).filter(Boolean).length;
};
