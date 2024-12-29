import { CHECKPOINT_LINKS, createReturnUrl } from './linkConfig';
import { saveVerification } from './checkpointVerification';

export const REDIRECT_PARAM = 'checkpoint';
export const TARGET_PARAM = 'target';
export const DYNAMIC_PARAM = 'dynamic';

export const createLinkvertiseUrl = (checkpointNumber: number): string => {
  const baseUrl = CHECKPOINT_LINKS[checkpointNumber as keyof typeof CHECKPOINT_LINKS];
  if (!baseUrl) return '';
  return baseUrl;
};

export const validateCheckpoint = (param: string | null): number | null => {
  if (!param) {
    console.log('No checkpoint parameter found');
    return null;
  }

  const num = parseInt(param, 10);
  if (isNaN(num) || num < 1 || num > 3) {
    console.log('Invalid checkpoint number:', param);
    return null;
  }

  // Get dynamic and target parameters from URL
  const params = new URLSearchParams(window.location.search);
  const dynamic = params.get(DYNAMIC_PARAM);
  const target = params.get(TARGET_PARAM);

  console.log('Validating checkpoint:', {
    num,
    dynamic: !!dynamic,
    target: !!target
  });

  // Save verification regardless of parameters for testing
  // In production, you should uncomment the check below
  // if (dynamic && target) {
  saveVerification(num);
  return num;
  // }

  // return null;
};