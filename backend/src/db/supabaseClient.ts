import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string;
const accessToken=process.env.SUPABASE_ACCESS_TOKEN as string
const supabaseServiceRoleKey=process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY as string


export const supabase = createClient(supabaseURL, supabaseServiceRoleKey);

