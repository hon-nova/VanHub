import express ,{Request, Response} from "express";
import { forwardAuthenticated } from "../middleware/checkAuth";
import { getPosts } from "../controllers/postController";

const router = express.Router();

router.get('/posts', async (req:Request,res:Response)=>{
	const user = req.user as Express.User
	console.log(`user @public/posts: `,user)
	console.log('Session exists @public/posts:', (req.session as any).passport.user);

	const posts = await getPosts()

	res.status(200).json({ posts,user, message: "Posts retrieved successfully!" });
})

export default router;