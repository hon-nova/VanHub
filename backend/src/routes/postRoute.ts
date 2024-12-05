import express ,{Request, Response} from "express";
import { forwardAuthenticated } from "../middleware/checkAuth";
import { getPosts, addPost } from "../controllers/postController";
import { Post } from '../shared/interfaces/index'
const router = express.Router();

router.get('/posts', async (req:Request,res:Response)=>{
	const user = req.user as Express.User
	console.log(`user @public/posts: `,user)
	console.log('Session exists @public/posts:', (req.session as any).passport.user);

	const posts = await getPosts()
	const sortedPosts = posts.sort((a:Post,b:Post)=>b.id - a.id)
	res.status(200).json({ posts,user});
})

router.post("/posts", async (req:Request,res:Response)=>{
	try {
		const {title,link,description,subgroup} = req.body
		console.log(`title: `,title)
		console.log(`description: `,description)
		const user = req.user as Express.User
		if(!user) throw new Error('@post : user not found')
		
		if(!title || !link || !description || !subgroup) throw new Error('@post Please fill in all required fields')
		const creator = user.id as string
		console.log(`req.body @/posts/add: `,req.body)
		// {title:'',link:'',description:'',creator:'',subgroup:''}
		const post = await addPost({title,link,description,creator,subgroup})
		console.log(`newPost just created: `, post)
		res.status(200).json({post,successMsg:'Post added.'})
	} catch(error){
		if(error instanceof Error){
			console.error(`error @/posts/add: `,error.message)
			res.status(500).json({errorMsg:error.message})
		}
		
	}
	
})

export default router;