import { CHECKPOINT_LINKS, createReturnUrl } from './linkConfig';
import { saveVerification } from './checkpointVerification';

export const REDIRECT_PARAM = 'checkpoint';
export const TARGET_PARAM = 'target';
export const DYNAMIC_PARAM = 'dynamic';

// Create the Linkvertise URL with proper destination URL encoding
export const createLinkvertiseUrl = (checkpointNumber: number): string => {
  const baseUrl =
    CHECKPOINT_LINKS[checkpointNumber as keyof typeof CHECKPOINT_LINKS];
  if (!baseUrl) return '';

  // Encode the return URL to ensure it works with Linkvertise
  const returnUrl = encodeURIComponent(createReturnUrl(checkpointNumber));

  return baseUrl;
};

// Validate the completion of a Linkvertise checkpoint
export const validateCheckpoint = (param: string | null): number | null => {
  if (!param) return null;

  const num = parseInt(param, 10);
  if (isNaN(num) || num < 1 || num > 3) return null;

  // Get dynamic and target parameters from URL
  const params = new URLSearchParams(window.location.search);
  const dynamic = params.get(DYNAMIC_PARAM);
  const target = params.get(TARGET_PARAM);

  // Only verify if we have the correct Linkvertise parameters
  if (dynamic && target) {
    saveVerification(num);
    return num;
  }

  return null;
};
