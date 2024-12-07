import { supabase } from '../db/supabaseClient'
import { Post, Comment, Vote } from '../shared/interfaces/index'
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
		console.log(`data return @addComment in postController: `,data)
		return data as Comment
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}
async function getCommentById(id:number):Promise<Comment|null>{
	try {
		let {data,error} = await supabase.from('comments').select().eq('id',id).single();
		if (error) throw new Error('@getCommentById: error getCommentById: ')
		console.log(`data @getCommentById in postController: `,data)
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
		})) as Comment[]
		const sortedComments = decoratedComments.sort((a:any,b:any)=>Number(b.id) - Number(a.id)) as Comment[]
	
		return sortedComments
	} catch(error){
		if(error instanceof Error) {		
			console.error(`catch: `,error.message);
		}		
		return []
	}
}
async function deleteComment(id:number):Promise<boolean>{
	try {
		const comment = await getCommentById(id)
		if(!comment) throw new Error('@deleteComment: comment not found')
			
		const {data,error} = await supabase.from('comments').delete().eq('id',id);
		if (error) throw new Error('@deleteComment: error deleteComment: ')
		console.log(`data @deleteComment in postController: `,data)
		return true
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return false
	}
}

async function getVoteByPostIdAndUserId(postId:number,user_id:string):Promise<Vote|null>{
	try {
		const {data,error} = await supabase.from('votes').select().eq('post_id',postId).eq('user_id',user_id).single();
		if (error) throw new Error(`@getVoteByPostIdAnUserId: error getVoteByPostIdAnUserId: ${error.message}`)
		console.log(`data @getVoteByPostIdAnUserId in postController: `,data)
		return data as Vote
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}
async function addNewOrUpdateVote(vote: {post_id:number,user_id:string,value?:number}):Promise<Vote|null>{
	try {
		const existingVote = await getVoteByPostIdAndUserId(vote.post_id,vote.user_id)
		let votes = await getVotes() as Vote[]
		console.log(`before votes length: `,votes.length)
		let updates: Partial<Vote> = {}
		updates = {
			value: vote.value
		}
		if(existingVote){
			if (existingVote.value === vote.value) {
				const { data, error } = await supabase.from('votes')
					.update({ value: 0 })
					.eq('post_id', vote.post_id)
					.eq('user_id', vote.user_id)
					.select('*')
					.single();
				if (error) throw new Error(`Error updating vote to neutral: ${error.message}`);
				return {...data,value:0} as Vote;
			}

			// Update the existing vote
			const { data, error } = await supabase.from('votes')
				.update({ value: vote.value })
				.eq('post_id', vote.post_id)
				.eq('user_id', vote.user_id)
				.select('*')
				.single();
			if (error) throw new Error(`Error updating vote: ${error.message}`);
			return data as Vote;
			
		} else {
			const newvote = {
				post_id: vote.post_id,
				user_id: vote.user_id,
				value: vote.value
			}
			const {data,error} = await supabase.from('votes').insert(newvote).select().single();
			console.log(`votes added @addNewOrUpdateVote in postController: `,data)
			if (error) throw new Error(`@addNewOrUpdateVote error: ${error.message}`)

			return data as Vote
		}	
		
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}

async function getVotes():Promise<Vote[]|null>{
	try {
		const {data,error} = await supabase.from('votes').select();
		if (error) throw new Error('@getVotes: error getVotes: ')
		const votes = data as Vote[]
		// console.log(`all votes @getVotes in postController: `,votes)
		return votes
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}
async function getVotesByPostId(postId:number):Promise<Vote[]|null>{
	try {
		const {data,error} = await supabase.from('votes').select().eq('post_id',postId);
		if (error) throw new Error('@getVotesByPostId: error getVotesByPostId: ')
		const votes = data as Vote[]
		// console.log(`all votes @getVotesByPostId in postController: `,votes)
		return votes
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}

async function getNetVotesByPostId(postId:number):Promise<number>{
	try {
		const votes = await getVotesByPostId(postId) as Vote[]
		// console.log(`all votes @getNetVotes in postController: `,votes)
		const netVotes:number = votes.reduce((acc:number,{ value })=>acc + value,0) as number	
		return netVotes		
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return 0
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
	// const comment = await getCommentById(4)
	// console.log(`async(): `,comment)
	// const commentToDelete = await deleteComment(2)
	// console.log(`async(): `,commentToDelete)
	// const votes = await getVotes()
	// console.log(`async(): `,votes)
	// const netVotes = await getNetVotesByPostId(20)
	// console.log(`async(): `,netVotes)
	// const newVote = {
	// 	post_id:13,
	// 	user_id:'52ee7094-de13-495b-83d5-13cd23c3e475', //admin
	// 	value:1
	// }
	// await addVote(newVote)
	// const oneVote = await getVoteByPostIdAndUserId(25,'6325cf1a-8d56-4963-8129-c3b7eb3d2d90')
	// console.log(`async(): `,oneVote)
	// const updatedAddVote = await addNewOrUpdateVote({post_id:13,user_id:'52ee7094-de13-495b-83d5-13cd23c3e475',value:-1})
	// console.log(`async(): `,updatedAddVote)
})()

 export { getPosts, addPost, getPostById, editPost, deletePost, getComments, addComment, deleteComment, getNetVotesByPostId, addNewOrUpdateVote}