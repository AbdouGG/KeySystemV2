import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { supabase } from '../config/supabase';
import { getHWID } from './hwid';

export const generateKey = async () => {
  try {
    console.log('Starting key generation process...');

    const key = uuidv4();
    const now = new Date();
    const expiresAt = addHours(now, 24);
    const hwid = getHWID();

    console.log('Checking for existing keys...');

    // Check if there's an existing valid key for this HWID
    const { data: existingKeys, error: fetchError } = await supabase
      .from('keys')
      .select('*')
      .eq('hwid', hwid)
      .eq('is_valid', true)
      .gte('expires_at', now.toISOString());

    if (fetchError) {
      console.error('Error fetching existing keys:', fetchError);
      throw fetchError;
    }

    if (existingKeys && existingKeys.length > 0) {
      console.log('Found existing valid key');
      return existingKeys[0];
    }

    console.log('Creating new key...');

    // Create new key
    const { data, error } = await supabase
      .from('keys')
      .insert([
        {
          key,
          hwid,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          is_valid: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating key:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from key creation');
    }

    console.log('Key generated successfully');
    return data;
  } catch (error) {
    console.error('Key generation failed:', error);
    throw error;
  }
};
