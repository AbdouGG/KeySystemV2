import { CHECKPOINT_LINKS, createReturnUrl } from './linkConfig';

export const REDIRECT_PARAM = 'checkpoint';

export const createLinkvertiseUrl = (checkpointNumber: number): string => {
  const baseUrl =
    CHECKPOINT_LINKS[checkpointNumber as keyof typeof CHECKPOINT_LINKS];
  if (!baseUrl) return '';

  // For link-center.net links, you'll set up the redirect URL directly in their dashboard
  return baseUrl;
};
