import express ,{Request, Response} from "express";
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get('/posts', (req:Request,res:Response)=>{
	const user = req.user as Express.User
	console.log(`user @public/posts: `,user)
	console.log('Session exists @public/posts:', (req.session as any).passport.user);

	const posts =[{id:1,title:"Girl 27",link:"http://phpbb.com/dui/nec/nisi/volutpat/eleifend.json",description:"Proin interdum mauris non ligula pellentesque ultrices.Maecenas pulvinar lobortis est.",creator:"",subgroup:"Networked",timestamp:"70-890-3228"},
	{id:3,title:"Penthouse North",link:"http://163.com/phasellus/id/sapien.jsp",description:"Maecenas tristique. Aliquam sit amet diam in magna bibendum imperdiet.",creator:"",subgroup:"orchestration",timestamp:"59-087-8487"}] 

	// return res.json({posts,successMsg:'Backend success - All Posts live here ... '}) as any
	res.status(200).json({ posts, message: "Posts retrieved successfully!" });
})

export default router;