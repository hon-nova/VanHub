import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;
const accessToken=process.env.SUPABASE_ACCESS_TOKEN as string

export const supabase = createClient(supabaseURL, supabaseAnonKey);
// headers: { Authorization: `Bearer ${USER_ACCESS_TOKEN}` },
// export const createSupabaseClient = (accessToken: string) => {
// 	return createClient(supabaseURL, supabaseAnonKey, {
// 	  headers: { Authorization: `Bearer ${supabaseKey}` },
// 	});
//  };
// const supabase = createClient(supabaseURL, supabaseKey, {
// 	global: {
// 	  headers: { Authorization: `Bearer ${supabaseAccessToken}` },
// 	},
//  });
 
//  export default supabase;
// const supabase = createClient(
// 	process.env.SUPABASE_URL as string,
// 	process.env.SUPABASE_ANON_KEY as string
//  );
 
//  export const supabaseWithAuth = (accessToken: string) => {
// 	return createClient(
// 	  process.env.SUPABASE_URL as string,
// 	  process.env.SUPABASE_ANON_KEY as string,
// 	  {
// 		 global: {
// 			headers: { Authorization: `Bearer ${accessToken}` },
// 		 },
// 	  }
// 	);
//  };
 
//  export default supabase;
