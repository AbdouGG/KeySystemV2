import { CHECKPOINT_LINKS, createReturnUrl } from './linkConfig';

export const REDIRECT_PARAM = 'checkpoint';

// Create the Linkvertise URL with proper destination URL encoding
export const createLinkvertiseUrl = (checkpointNumber: number): string => {
  const baseUrl = CHECKPOINT_LINKS[checkpointNumber as keyof typeof CHECKPOINT_LINKS];
  if (!baseUrl) return '';
  
  // Encode the return URL to ensure it works with Linkvertise
  const returnUrl = encodeURIComponent(createReturnUrl(checkpointNumber));
  
  // For link-center.net, you need to set up the destination URL in their dashboard
  // Make sure the destination URL matches your Netlify domain
  return `${baseUrl}`;
};