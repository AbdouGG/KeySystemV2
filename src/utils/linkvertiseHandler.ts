import { CHECKPOINT_LINKS, createReturnUrl } from './linkConfig';
import { saveVerification, getVerifications } from './checkpointVerification';

export const REDIRECT_PARAM = 'checkpoint';
export const TARGET_PARAM = 'target';
export const DYNAMIC_PARAM = 'dynamic';

export const createLinkvertiseUrl = (checkpointNumber: number): string => {
  const baseUrl =
    CHECKPOINT_LINKS[checkpointNumber as keyof typeof CHECKPOINT_LINKS];
  if (!baseUrl) return '';

  const returnUrl = encodeURIComponent(createReturnUrl(checkpointNumber));
  return baseUrl;
};

export const validateCheckpoint = (param: string | null): number | null => {
  if (!param) return null;

  const num = parseInt(param, 10);
  if (isNaN(num) || num < 1 || num > 3) return null;

  // Get dynamic and target parameters from URL
  const params = new URLSearchParams(window.location.search);
  const dynamic = params.get(DYNAMIC_PARAM);
  const target = params.get(TARGET_PARAM);

  // Save verification regardless of dynamic/target params to fix the checkpoint counting
  saveVerification(num);
  return num;
};