import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseURL, supabaseAnonKey);
