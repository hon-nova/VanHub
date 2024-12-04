import 'dotenv/config';
import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js'
// console.log(`process.env:: `, process.env)

const client = new Client({
  connectionString: process.env.DATABASE_URL, 
});
const supabaseURL=process.env.SUPABASE_URL as string
const supabaseAnonKey=process.env.SUPABASE_ANON_KEY as string
export const supabase = createClient(supabaseURL, supabaseAnonKey)

export default client