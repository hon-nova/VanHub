import express from "express";
import passport from "passport";
import { forwardAuthenticated, isAdmin } from "../middleware/checkAuth";
import { IVerifyOptions } from "passport-local";
const router = express.Router();
import {Request, Response} from 'express'
import client from '../db/supabaseClient'
import bcrypt from 'bcrypt'
const saltValue =8
import { getUserByEmail, getUserByEmailAndPassword } from '../controllers/userController'

router.post("/register", async (req:Request, res:Response) => {
	const { uname, email, password } = req.body

	if(!uname || !email ||!password){
		console.log('All fields cannot be empty.')
		return
	}
	const hashedPassword = bcrypt.hashSync(password,saltValue)
	// const hash = bcrypt.hashSync('jessstephenson',saltValue)
	// if(hashedPassword){
	// 	console.log(`hashedPassword: `, hashedPassword)
	// }
	//fetch data from db
	const stm = 'SELECT * FROM public.users WHERE email = $1';
	const getUser = await client.query(stm,[email])
	if(getUser.rows.length > 0){
		console.log('Email already exists. Please use another email.')
		return res.status(400).json({errorEmail:'Email already exists. Please use another email.'}) as any
	}

	const stm2 = 'SELECT * FROM public.users WHERE uname = $1';
	const getUser2 = await client.query(stm2,[uname])
	if(getUser2.rows.length > 0){
		console.log('Username already exists.')
		return res.status(400).json({errorUname:'Username already exists. Please use another username.'}) as any
	}

	const stm3 = 'INSERT INTO public.users (uname,email,password) VALUES ($1,$2,$3) RETURNING *';
	const newUser = await client.query(stm3,[uname,email,hashedPassword])	
	if(newUser.rows.length > 0){
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
 
//  router.get("/github", passport.authenticate("github"));
 
//  router.get(
// 	"/github/callback",
// 	passport.authenticate("github", { failureRedirect: "/auth/login" }),
 
// 	function (req: Request, res: Response) {
// 	  res.redirect("/dashboard");
// 	}
//  );

//  router.get("/logout", (req, res) => {
// 	req.logout((err) => {
// 	  if (err) {
// 		 console.log(err);
// 		 return res.redirect("/auth/login");
// 	  }
// 	  res.redirect("/auth/login");
// 	});
//  });
router.post('/logout', (req: Request, res: Response) => {
	req.logout((err) => {
		 if (err) {
			  console.error('Error logging out:', err);
			  return res.status(500).json({ message: 'Logout failed. Please try again.' });
		 }
		 res.status(200).json({ message: 'Successfully logged out.' });
	});
});
 
 

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/posts",
//     failureRedirect: "/auth/login",
//   })
// );

router.get("/logout", (req, res, next) => {
  	req.logout(function (err) {
		if (err) {
			return next(err);
		}
  	});
  	res.redirect("/");
});

export default router;