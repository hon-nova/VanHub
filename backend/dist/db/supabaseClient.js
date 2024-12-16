"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
require("dotenv/config");
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseURL = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const supabaseServiceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;
console.log(`process.env: `, process.env);
/**
 REACT_APP_SUPABASE_URL=https://pvvdexpxtesuyjnodslj.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dmRleHB4dGVzdXlqbm9kc2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMzIzMzksImV4cCI6MjA0ODYwODMzOX0.iRmuj85ZS0Lw_Arof_VKVR7cN3IlbU4hIY2q_cAKOws
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dmRleHB4dGVzdXlqbm9kc2xqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzAzMjMzOSwiZXhwIjoyMDQ4NjA4MzM5fQ.BUELlzm3AsOnjcdV14uF5jdLGf0jsQFT23bmGITfXXE
SUPABASE_ACCESS_TOKEN=sbp_b2fee2e59d97b4405064e82b53fcd02001c4a9b6
 */
exports.supabase = (0, supabase_js_1.createClient)(supabaseURL, supabaseServiceRoleKey);
