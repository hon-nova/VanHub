import express from "express";
// import passport from "../middleware/passportMiddeleware";
// import passport from '../middleware/passportMiddleware'
const router = express.Router();
import {Request, Response} from 'express'
import client from '../db/supabaseClient'
import bcrypt from 'bcrypt'
const saltValue =16

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
		return res.status(200).json({successMsg:'Registered successfully.'}) as any
	}
  
});

router.get("/login", async (req, res) => {
  res.render("login");
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