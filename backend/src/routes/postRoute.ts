import express ,{Request, Response} from "express";
import { forwardAuthenticated } from "../middleware/checkAuth";
import { getPosts, addPost, editPost, deletePost, getCommentsByPostId, addComment, deleteComment, getNetVotesByPostId, addNewOrUpdateVote } from "../controllers/postController";
import { Post } from '../shared/interfaces/index'
const router = express.Router();

router.get('/posts', async (req:Request,res:Response)=>{
	const user = req.user as Express.User
	console.log(`user @public/posts: `,user)
	if (!req.isAuthenticated()) {
		console.log(`user not authenticated @public/posts`)
		return res.status(401).send({ error: 'User not authenticated' }) as any
		
	 }
	//  console.log('Authenticated User:', req.user);
	// console.log(`user @public/posts: `,user)
	// console.log('Session exists @public/posts:', (req.session as any).passport.user);

	const posts = await getPosts()
	res.status(200).json({ posts,user});
})

router.post("/posts", async (req:Request,res:Response)=>{
	try {
		const {title,link,description,subgroup} = req.body
		const user = req.user as Express.User
		if(!user) throw new Error('Please login to add posts.')
		
		if(!title || !link || !description || !subgroup) throw new Error('Please fill in all required fields')
		const creator = user?.id as string
		const post = await addPost({title,link,description,creator,subgroup})
		res.status(200).json({post,successMsg:'Post added.'})
	} catch(error){
		if(error instanceof Error){
			console.error(`error @/posts/add: `,error.message)
			res.status(500).json({errorMsg:error.message})
		}
	}	
})

router.post("/posts/edit/:id", async (req:Request,res:Response)=>{
	try {
		const id = Number(req.params.id)
		const {title,link,description,subgroup} = req.body
		if(!title || !link || !description || !subgroup) throw new Error('@post Please fill in all required fields')

		const updatedPost = await editPost(id,{title,link,description,subgroup})
		console.log(`updatedPost @/posts/edit: `,updatedPost)
		if(!updatedPost) throw new Error('@editPost: error updating post')

		res.status(200).json({post:updatedPost,successMsg:'Post updated.'})

	} catch(error){
		if(error instanceof Error){
			console.error(`error @/posts/edit: `,error.message)
			res.status(500).json({errorMsg:error.message})
		}
	}
})
router.delete("/posts/delete/:id", async (req:Request,res:Response)=>{
	try {
		const id = Number(req.params.id)
		const isDeleted = await deletePost(id)
		if(!isDeleted) throw new Error('@deletePost: error deleting post')

		res.status(200).json({successMsg:'Post deleted.'})
	} catch(error){
		if(error instanceof Error){
			console.error(`error @/posts/delete: `,error.message)
			res.status(500).json({errorMsg:error.message})
		}
	}	
})

router.post('/posts/comment-create/:postid', async (req:Request,res:Response)=>{
	try {
		const { description } = req.body
		const post_id = Number(req.params.postid)
		console.log(`description @/posts/comment-create: `,description)
		const user = req.user as Express.User
		const creator = user?.id as string
		console.log(`creator at /posts/comment-create/:postid: `,creator)
		if(!description)  {
			throw new Error('@post Please add your comment content.')
		} 		
		const newComment = await addComment({post_id,description,creator})		
		// console.log(`newComment: `,newComment)
		res.status(200).json({comment:newComment,successMsg:'Comment added.'})		
		
	} catch(error){
		if(error instanceof Error){
			console.error(`error @/posts/comments: `,error.message)
			res.status(500).json({errorMsg:error.message})
		}
	}
})

router.get('/posts/show/:postid', async (req:Request,res:Response)=>{
	try {
		const post_id = Number(req.params.postid)
		const comments = await getCommentsByPostId(post_id)
		
		const netVotesDb = await getNetVotesByPostId(post_id)
		res.status(200).json({comments,netVotesDb})
	} catch(error){
		if(error instanceof Error){
			console.error(`error @/posts/comments: `,error.message)
			res.status(500).json({errorMsg:error.message})
		}
	}
})
router.delete('/posts/comment-delete/:commentid', async (req:Request,res:Response)=>{
	try {
		const commentId = Number(req.params.commentid)
		const isDeleted = await deleteComment(commentId)
		if(isDeleted){
			res.status(200).json({successMsg:'Comment deleted.'})
		}
	} catch(error){
		if(error instanceof Error){
			console.error(`delete error @/posts/comments: `,error.message)
			res.status(500).json({errorMsg:error.message})
		}
	}
})

router.post("/posts/vote/:postid", async (req:Request,res:Response)=>{
	try {
		const post_id = Number(req.params.postid)
		const user = req.user as Express.User
		if(!user){
			throw new Error('@post Please login to vote.')
		}
		const user_id = user.id as string
		console.log(`user_id: `,user_id)
		
		const value  = Number(req.body.setvoteto)
		console.log(`setvoteto: `,value)
		
		console.log(`post_id: `,post_id)
		if(!value) throw new Error('@post Please add your vote.')
		
		const updatedNetVotes = await addNewOrUpdateVote({post_id,user_id,value})
		const netVotesDb = await getNetVotesByPostId(post_id)
		console.log(`backend netVotesDb for post_id ${post_id}: `,netVotesDb)
		
		if(updatedNetVotes){
			res.status(200).json({setvoteto: updatedNetVotes.value,netVotesDb})
		} else {
			throw new Error('@addVote: error adding vote')
		}		
	} catch(error){
		if(error instanceof Error){
			console.error(`error @/posts/vote: `,error.message)
			res.status(500).json({errorVoteMsg:error.message})
		}
	}
})

export default router;