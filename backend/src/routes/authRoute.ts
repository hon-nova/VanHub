import express from "express";
import passport from "passport";
import { forwardAuthenticated, isAdmin } from "../middleware/checkAuth";
import { IVerifyOptions } from "passport-local";
const router = express.Router();
import {Request, Response} from 'express'
import bcrypt from 'bcrypt'
const saltValue =8
import { addUser, getUserByEmail, getUserByEmailAndPassword,getUserByUnameOrEmail,resetPassword } from '../controllers/userController'

router.post("/register", async (req:Request, res:Response) => {
	const { uname, email, password } = req.body

	if(!uname || !email ||!password){
		console.log('All fields cannot be empty.')
		return
	}
	const hashedPassword = bcrypt.hashSync(password,saltValue)
	
	const getUser = await getUserByEmail(uname) as Express.User
	if(getUser !== null){
		console.log('Username already existed. Please use another username.')
		return res.status(400).json({errorEmail:'Email already exists. Please use another email.'}) as any
	}

	const getUser2 = await getUserByEmail(email) as Express.User
	if(getUser2 !== null){
		console.log('Username already exists.')
		return res.status(400).json({errorUname:'Email already existed. Please use another email.'}) as any
	}
	const newUser = await addUser(uname,email,hashedPassword)
	if(newUser){
		console.log('Registered successfully.')
		return res.status(200).json({successMsg:'registered successfully.'}) as any
	}  
});

router.post("/login", (req, res, next) => {
	passport.authenticate(
	  "local",
	  { failureRedirect: "/auth/login", failureMessage: true },
	  (err: Error, user: Express.User, info: IVerifyOptions) => {
			if (err) {
				console.error('errorLogin:', err.message);
				return res.status(500).json({errorLogin:`errorLogin ${err.message}`})
			} 
			if (!user) {
				const errorE = info?.message || "backend /login: NO SUCH USER";
				console.error('errorEmail:', info?.message);
				return res.status(401).json({errorLogin:`${errorE}`})
			}
			req.logIn(user, (err) => {
				if (err) {
					console.error('req.logIn Error:', info?.message);
					return res.status(500).json({ errorLogin: `req.logIn: ${err.message}` });
				 }
				//success
				const successMsg = `Success. Redirecting ...`
				if (isAdmin(req)) {
					return res.status(200).json({user: user, isAdmin:true, successMsg})
				} else {
					return res.status(200).json({user: user, isAdmin:false, successMsg})
				}
			});
	  }
	)(req, res, next);
 });
 
router.get("/github", passport.authenticate("github"));
 
router.get(
	"/github/callback",
	passport.authenticate("github", { failureRedirect: "/auth/login" }), 
	function (req: Request, res: Response) {
	  res.redirect("http://localhost:3000/posts");
	}
);

router.post('/forgot', async (req: Request, res: Response) => {
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
			console.log('NO SUCH USER/EMAIL')
			return res.status(400).json({errorEmail:'NO SUCH USER/EMAIL'}) as any
		}
		const updatedPwdUser = await resetPassword(info,newpassword)
		if(updatedPwdUser){
			console.log('Password reset successfully.')
			return res.status(200).json({successReset:'Password reset successfully.'}) as any
		}
	} catch(error){
		console.error('Backend Error in forgot:', error)
	}
})
router.post('/logout', (req: Request, res: Response) => {
	req.logout((err) => {
		if (err) {
			console.error('Error logging out:', err);
			return res.status(500).json({ message: 'Logout failed. Please try again.' });
		}
		res.status(200).json({ message: 'Successfully logged out.' });
	});
});

export default router;