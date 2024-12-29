// Configuration for checkpoint links and redirects
export const CHECKPOINT_LINKS = {
  1: 'https://link-target.net/1174023/check-point-1',
  2: 'https://link-center.net/1174023/nurk-hub-checkpoint-2',
  3: 'https://link-center.net/1174023/nurk-hub-checkpoint-3',
} as const;

// The base URL where your key system is hosted
export const SITE_URL = import.meta.env.DEV
  ? 'http://localhost:5173' // Local development URL
  : 'https://nurkhub-getkey.netlify.app'; // Production URL

// Create the full return URL for a checkpoint
export const createReturnUrl = (checkpointNumber: number): string => {
  return `${SITE_URL}/?checkpoint=${checkpointNumber}`;
};
