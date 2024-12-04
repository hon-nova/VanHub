import express ,{Request, Response} from "express";
import { forwardAuthenticated } from "../middleware/checkAuth";
import { getPosts, addPost } from "../controllers/postController";

const router = express.Router();

router.get('/posts', async (req:Request,res:Response)=>{
	const user = req.user as Express.User
	console.log(`user @public/posts: `,user)
	console.log('Session exists @public/posts:', (req.session as any).passport.user);

	const posts = await getPosts()
	console.log(`posts @public/posts: `,posts)
	res.status(200).json({ posts,user});
})

router.post("/add", async (req:Request,res:Response)=>{
	try {
		const {title,link,description,subgroup} = req.body
		const user = req.user as Express.User
		if(!user) throw new Error('@post /add: user not found')
		
		const creator = user.id as string
		console.log(`req.body @/posts/add: `,req.body)
		// {title:'',link:'',description:'',creator:'',subgroup:''}
		const post = await addPost({title,link,description,creator,subgroup})
		res.status(200).json({post,msg:'successfully added new post.'})
	} catch(error){
		console.error(`error @/posts/add: `,error)
	}
	
})

export default router;