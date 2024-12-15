import { supabase } from '../db/supabaseClient'
import { Post, Comment, Vote } from '../shared/interfaces/index'
import { getUserById } from './userController'


function formatTimestamp(timestamp:number|null):string|null{
	if (timestamp == null) {
		console.error('Invalid timestamp:', timestamp);
		return null;
  	}

	const data = new Date(timestamp)
	
	const dataFormatted = data.toLocaleString('en-US', {
		month:'short',
		day:'numeric',
		year:'numeric',
		hour:'2-digit',
		minute:'2-digit',
		second:'2-digit',
		hour12:true
	})
	
	return data.toLocaleString('en-US', {
		month:'short',
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
			
			let newPost = {
				...p,
				creator: await getUserById(p.creator as string) || null,
				timestamp: formatTimestamp(p.timestamp) ||null
			}
			return newPost
		}))
		const sortedPosts = posts.sort((a:any,b:any)=>(Number(b.id) - Number(a.id))) as any
			
		return sortedPosts as Post[]
	} catch (error) {
		if(error instanceof Error) {
			console.error(`error @getPosts: `, error.message);
		}
		return []
	}
}

async function addPost(post:{title:string,link:string,description:string,creator:string,subgroup:''}):Promise<Post|null>{
	let newPost = {
		...post,
		timestamp: Date.now()
	}
	try {
		const {data,error} = await supabase.from('posts').insert(newPost).select().single();
		if (error) throw new Error('@addPost: error addPost ')
		
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
		
		const updates: Partial<Post> = {}
		if(post){
			if(changes.title) {updates.title = changes.title}
			if(changes.link) {updates.link = changes.link}
			if(changes.description) {updates.description = changes.description}
			if(changes.subgroup) {updates.subgroup = changes.subgroup}

			const {data,error} = await supabase.from('posts').update(updates).eq('id',id).select('*').single();
			if (error) throw new Error(`@editPost: function error: ${error.message}`)
			
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
		
		const newComment = {			
			...comment,
			timestamp: Date.now()
		}
		const {data,error} = await supabase.from('comments').insert(newComment).select().single();
		if (error) throw new Error('@addComment: error addComment ')
		
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
		
		return data as Comment

	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return null
	}
}
async function getCommentsByPostId(post_id:number): Promise<Comment[]>{
	try {
		const {data,error} = await supabase
		.from('comments')
		.select()
		.eq('post_id',post_id);
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
		
		const netVotes:number = votes.reduce((acc:number,{ value })=>acc + value,0) as number	
		return netVotes		
	} catch(error){
		if(error instanceof Error) {
			console.error(`catch: `,error.message);
		}		
		return 0
	}
}


 export { getPosts, addPost, getPostById, editPost, deletePost, getCommentsByPostId, addComment, deleteComment, getNetVotesByPostId, addNewOrUpdateVote}