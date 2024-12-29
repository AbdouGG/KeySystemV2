import { CHECKPOINT_LINKS, createReturnUrl } from './linkConfig';
import { saveVerification } from './checkpointVerification';

export const REDIRECT_PARAM = 'checkpoint';

// Create the Linkvertise URL with proper destination URL encoding
export const createLinkvertiseUrl = (checkpointNumber: number): string => {
  const baseUrl = CHECKPOINT_LINKS[checkpointNumber as keyof typeof CHECKPOINT_LINKS];
  if (!baseUrl) return '';
  return baseUrl;
};

// Validate the completion of a Linkvertise checkpoint
export const validateCheckpoint = (param: string | null): number | null => {
  if (!param) return null;

  const num = parseInt(param, 10);
  if (isNaN(num) || num < 1 || num > 3) return null;

  // Save verification immediately when checkpoint parameter is valid
  saveVerification(num);
  return num;
};