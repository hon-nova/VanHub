import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;
const accessToken=process.env.SUPABASE_ACCESS_TOKEN as string
const supabaseServiceRoleKey=process.env.SUPABASE_SERVICE_ROLE_KEY as string
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dmRleHB4dGVzdXlqbm9kc2xqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAzMjMzOSwiZXhwIjoyMDQ4NjA4MzM5fQ.BUELlzm3AsOnjcdV14uF5jdLGf0jsQFT23bmGITfXXE

// (async()=>{
// 	console.log(`supabaseServiceRoleKey: `, supabaseServiceRoleKey)
// })()
// export const supabase = createClient(supabaseURL, supabaseAnonKey);
export const supabase = createClient(supabaseURL, supabaseServiceRoleKey);

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
