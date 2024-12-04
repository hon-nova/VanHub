import client from '../db/supabaseClient'
import { Post } from '../shared/interfaces/index'

const getPosts = async () => {
	try {
	  const query = 'SELECT * FROM posts;';
	  const result = await client.query(query);
	  const data = result.rows;
	  console.log(`data @getPosts: `, data);
	  return data
	} catch (error) {
	  console.error(`error @getPosts: `, error);
	}
 };

 export { getPosts}