import { supabase } from '../db/supabaseClient'
import { Post, Comment } from '../shared/interfaces/index'
import { getUserById } from './userController'

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
async function getPosts():Promise<any>{
	try {
		const {data,error} = await supabase.from('posts').select();
		if (error) throw new Error('@getPosts: error getPosts: ')
		const posts = await Promise.all(
			data.map(async(p:Post)=> {
			// const user = Promise.all(await getUserById(p.creator))
			let newPost = {
				...p,
				creator: await getUserById(p.creator as string) || null,
				timestamp: formatTimestamp(p.timestamp) ||null
			}
			return newPost
		}))
		const sortedPosts = posts.sort((a:any,b:any)=>(Number(b.id) - Number(a.id))) as any
		// console.log(`all sortedPostes @getPosts in postController: `,sortedPosts)	
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
async function addPost(post:{title:string,link:string,description:string,creator:string,subgroup:''}):Promise<Post|null>{
	let newPost = {
		...post,
		timestamp: Date.now()
	}
	try {
		const {data,error} = await supabase.from('posts').insert(newPost).select().single();
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

async function getPostById(id:number):Promise<Post|null>{
	try {
		const {data,error} = await supabase.from('posts').select().eq('id',id).single();
		if (error) throw new Error('@getPostById: error getPostById: ')
		// console.log(`data @getPostById in postController: `,data)
		return data as Post
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}
async function editPost(id:number,changes:{title?:string,link?:string,description?:string,subgroup?:string}):Promise<Post|null>{
	try {
		const post = await getPostById(id)
		// console.log(`post @editPost in postController: `,post)
		const updates: Partial<Post> = {}
		if(post){
			if(changes.title) {updates.title = changes.title}
			if(changes.link) {updates.link = changes.link}
			if(changes.description) {updates.description = changes.description}
			if(changes.subgroup) {updates.subgroup = changes.subgroup}

			const {data,error} = await supabase.from('posts').update(updates).eq('id',id).select('*').single();
			if (error) throw new Error(`@editPost: function error: ${error.message}`)
			// console.log(`data @editPost in postController: `,data)
			return data as Post
		} else {			
			return null
		}		
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}

async function deletePost(id:number):Promise<boolean>{
	try {
		const post = await getPostById(id)
		if(!post) throw new Error('@deletePost: post not found')
			
		const {data,error} = await supabase.from('posts').delete().eq('id',id);
		if (error) throw new Error('@deletePost: error deletePost: ')
		console.log(`data @deletePost in postController: `,data)
		return true
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return false
	}
}

async function addComment(comment: {post_id:number,description:string,creator:string}):Promise<Comment|null>{
	try {
		//post_id:number,
	//creator: string | User,
	//description: string,
		const newComment = {			
			...comment,
			timestamp: Date.now()
		}
		const {data,error} = await supabase.from('comments').insert(newComment).select().single();
		if (error) throw new Error('@addComment: error addComment ')
		// console.log(`data return @addComment in postController: `,data)
		return data as Comment
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}
async function getComments(): Promise<Comment[]>{
	try {
		const {data,error} = await supabase.from('comments').select();
		if (error) throw new Error('@getComments: error getComments: ')
		const comments = data as Comment[]
		
		const decoratedComments = await Promise.all(comments.map(async(c:Comment)=>{
			return {
				...c,
				creator: await getUserById(c.creator as string) || null,
				timestamp: formatTimestamp(c.timestamp) ||null
			}
		}))
		console.log(`all decorated comments formatted @getComments in postController: `,decoratedComments)	
		return decoratedComments as Comment[]
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return []
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
	// addComment(comment: {post_id:number,description:string,creator:string})
	// const comment = {
	// 	post_id:27,
	// 	description:'This is a new comment',
	// 	creator:'6325cf1a-8d56-4963-8129-c3b7eb3d2d90'
	// }
	// await addComment(comment)
	// const comments = await getComments()
	// console.log(`async(): `,comments)
})()

 export { getPosts, addPost, getPostById, editPost, deletePost, getComments, addComment}