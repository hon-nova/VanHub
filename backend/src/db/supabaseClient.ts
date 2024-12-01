import 'dotenv/config';
import { Client } from 'pg';
// console.log(`process.env:: `, process.env)

const client = new Client({
  connectionString: process.env.DATABASE_URL, 
});

export default client