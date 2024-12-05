import { supabase } from '../db/supabaseClient'
import { Post } from '../shared/interfaces/index'

// const getPosts = async () => {
// 	try {
// 	  const query = 'SELECT * FROM posts;';
// 	  const result = await client.query(query);
// 	  const data = result.rows;
// 	  console.log(`data @getPosts: `, data);
// 	  return data
// 	} catch (error) {
// 	  console.error(`error @getPosts: `, error);
// 	}
//  };
function formatTimestamp(timestamp:number|null):string|null{
	if (timestamp == null) {
		console.error('Invalid timestamp:', timestamp);
		return null;
  	}

	const data = new Date(timestamp)
	// console.log(`date Object @formatTimestamp: `,data)
	const dataFormatted = data.toLocaleString('en-US', {
		month:'long',
		day:'numeric',
		year:'numeric',
		hour:'2-digit',
		minute:'2-digit',
		second:'2-digit',
		hour12:true
	})
	// console.log(`dataFormatted @formatTimestamp: `,dataFormatted)
	return data.toLocaleString('en-US', {
		month:'long',
		day:'numeric',
		year:'numeric',
		hour:'2-digit',
		minute:'2-digit',
		second:'2-digit',
		hour12:true
	})
} 


async function getPosts():Promise<Post[]>{
	try {
		const {data,error} = await supabase.from('posts').select();
		if (error) throw new Error('@getPosts: error getPosts: ')
		const posts = data.map((p:Post)=> {
			let newPost = {
				...p,
				timestamp: formatTimestamp(p.timestamp) ||null
			}
			return newPost
		})
		const sortedPosts = posts.sort((a,b)=>(Number(b.id) - Number(a.id)))
			
		return sortedPosts as Post[]
	} catch (error) {
		if(error instanceof Error) {
			console.error(`error @getPosts: `, error.message);
		}
		return []
	}
}
/*
export type Post = {
	id: string,
	title:string,
	link:string,
	description:string,
	creator:string,
	subgroup: string,
	timestamp: number
}
*/
async function addPost(post= {title:'',link:'',description:'',creator:'',subgroup:''}):Promise<Post|null>{
	let newPost = {
		...post,
		timestamp: Date.now()
	}
	try {
		const {data,error} = await supabase.from('posts').insert(newPost).single();
		if (error) throw new Error('@addPost: error addPost ')
		console.log(`data @addPost in postController: `,data)
		return data as Post
	} catch (error) {
		if(error instanceof Error) {
			console.error(`catch @addPost: `,error.message);
		}		
		return null
	}
}
(async()=>{
	// const post = {
	// 	title:'New Post',
	// 	link:'https://www.google.com',
	// 	description:'This is a new post',
	// 	creator:'4be98560-c532-437c-9f29-54c75d30a228',
	// 	subgroup: 'google news'
	// }
	// await addPost(post)
})()

 export { getPosts, addPost}