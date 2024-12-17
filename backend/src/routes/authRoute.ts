import express from "express";
import passport from "passport";
import { forwardAuthenticated, isAdmin } from "../middleware/checkAuth";
import { IVerifyOptions } from "passport-local";
const router = express.Router();
import {Request, Response} from 'express'
import bcrypt from 'bcrypt'
const saltValue =8
import { addUser, getUserByEmail, getUserByUname, getUserByEmailAndPassword,getUserByUnameOrEmail,resetPassword, getUsers } from '../controllers/userController'
import { getPosts } from "../controllers/postController";
import { positivePosts,negativePosts,neutralPosts } from '../controllers/authController'

router.post("/register", async (req:Request, res:Response) => {
	try {
		const { uname, email, password } = req.body

	if(!uname || !email ||!password){
		console.log('All fields cannot be empty.')
		return
	}
	
	const getUser = await getUserByUname(uname) as Express.User
	console.log(`getUserByUname in /register: `, getUser)
	if(getUser !== null){
		// console.log('Username already existed. Please use another username.')
		return res.status(400).json({errorEmail:'Username already exists. Please use another uname.'}) as any
	}

	const getUser2 = await getUserByEmail(email) as Express.User
	console.log(`getUserByEmail in /register: `, getUser)
	if(getUser2 !== null){
		console.log('Email already exists.')
		return res.status(400).json({errorEmail:'Email already existed. Please use another email.'}) as any
	}
	let avatar =''
	const newUser = await addUser(uname,email,password,avatar)
	
	if(newUser){
		
		return res.status(200).json({successMsg:'registered successfully.'}) as any
	} else {
		throw new Error('Failed to register.')
	} 
	} catch(error){
		if(error instanceof Error){
			console.error('Error in /register:', error.message)
			return res.status(500).json({errorRegister:`Error in /register: ${error.message}`}) as any
		}
	}
	
});

router.post("/login", (req, res, next) => {
	passport.authenticate(
	  "local",
	  { failureRedirect: "/auth/login", failureMessage: true },
	  (err: Error, user: Express.User, info: IVerifyOptions) => {
			if (err) {
				
				return res.status(500).json({errorLogin:`errorLogin ${err.message}`})
			} 
			if (!user) {
				const errorE = info?.message || "backend /login: NO SUCH USER";
				
				return res.status(401).json({errorLogin:`${errorE}`})
			}
			req.logIn(user, (err) => {
				if (err) {
					
					return res.status(500).json({ errorLogin: `req.logIn: ${err.message}` });
				 }
				
				const successMsg = `Success. Redirecting ...`
				if (isAdmin(req)) {
					return res.status(200).json({user: user, isAdmin:true, successMsg})
				} else {
					console.log('@login User logged in:', user);
      			console.log('@login Session after login session:', (req.session as any).passport.user);
					// console.log('@login Session after login session.user:', req.session.user);
					return res.status(200).json({user: user, isAdmin:false, successMsg})
				}
			});
	  }
	)(req, res, next);
 });
 
router.get("/github", passport.authenticate("github",{ scope: ["user:email"] }));
 
router.get("/github/callback",passport.authenticate("github", { session: true}), 
	(req: Request, res: Response)=> {
		
		console.log("route backend/ github user:", JSON.stringify(req.user, null, 2));
		 
		 req.session.save((err) => {
			if (err) {
			  console.error('Session save error:', err);
			  return res.status(500).send({ error: 'Failed to save session.' });
			}
			if(req.user?.role === 'admin'){
				res.redirect(`${process.env.REACT_APP_FRONTEND_BASEURL}/auth/admin`);
			} else {
				res.redirect(`${process.env.REACT_APP_FRONTEND_BASEURL}/public/posts`);
			}			  		
	});
})

router.post('/forgot',forwardAuthenticated, async (req: Request, res: Response) => {
	try {
		const { info, newpassword, confirmnewpassword } = req.body
		if (!info || !newpassword || !confirmnewpassword) {
			console.log('All fields cannot be empty.')
			return;
		}
		if (newpassword !== confirmnewpassword) {
			console.log('Passwords do not match.')
			return; 
		}
		const user = await getUserByUnameOrEmail(info,info) as Express.User
		if(!user || !user.password){
			
			return res.status(400).json({errorEmail:'NO SUCH USER/EMAIL'}) as any
		}
		const updatedPwdUser = await resetPassword(info,newpassword)
		if(updatedPwdUser){
			
			return res.status(200).json({successReset:'Password reset successfully.'}) as any
		}
	} catch(error){
		console.error('Backend Error in forgot:', error)
	}
})

router.post('/logout', (req: Request, res: Response) => {
	const user = req.user 
	
	req.session.destroy((err) => {
		if (err) {
			console.error('Error destroying session:', err);
			return res.status(500).json({ errorMsg: 'Failed to log out.' });
		} 
	  res.clearCookie('connect.sid'); 
	  res.status(200).json({ successMsg: 'Successfully logged out.' });
	});
});

router.get("/admin",(req: Request, res: Response)=>{
	const adminUser = req.user as Express.User
	if (!req.isAuthenticated()) {
		console.log(`user not authenticated @admin`)
	 }
	
	res.status(200).json({adminUser,successMsg:'Admin user is authenticated.'})
})

router.get("/admin/posts", async (req: Request, res: Response) => {
	const posts = await getPosts()
	
	const positive = await positivePosts();
	const negative = await negativePosts();
	const neutral = await neutralPosts();
	
	if (!req.isAuthenticated()) {
		console.log(`admin not authenticated @admin/posts`)
	}
	return res.status(200).json({
		posts: positive.decoratedPosts, 
		pos: {posts: positive.posts, percentagePositive:positive.percentagePositive,percentagePCS:positive.percentagePCS},
		neg: {posts: negative.posts,percentageNegative:negative.percentageNegative,percentageNCS:negative.percentageNCS},
		neu: {posts: neutral.posts,percentageNeutral:neutral.percentageNeutral, percentageNeutralCS:neutral.percentageNeutralCS}
		}) as any
	})


router.post("/admin/posts", async (req: Request, res: Response) => {

})

router.get('/admin/users', async (req: Request, res: Response) => {
	const users = await getUsers()
	const usersWithoutAdmin = users?.filter((user:any)=>user.role !== 'admin')
	return res.status(200).json({users:usersWithoutAdmin}) as any
})


export default router;