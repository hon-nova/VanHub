import express, {Request, Response} from 'express'
import passport from 'passport'
import path from 'path'
import fs from 'fs'
import { handleAvatarGeneration, saveAvatarToDisk } from '../controllers/userController'

// import Colors from '../utils/color.js'
import dotenv from 'dotenv'
dotenv.config()


// console.log(`open_ai_key in userRoute: `, process.env.OPEN_AI_KEY)
const router = express.Router()

router.get('/', (req,res)=>{
	const user = (req.user as Express.User)
	console.log(`user in get /user/profile: `, user)
	res.json({user})
})

import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPEN_ACCESS_KEY });
router.get('/', async (req,res)=>{
	const user = (req.user as Express.User)
	//the user should have an avatar now
	console.log(`user in get/: `, user)
	return res.json({user}) as any
})

router.post('/settings', async (req,res)=>{
	try {
		const { description } = req.body
		const user = req.user as Express.User
		const user_id = user.id 
		console.log(`user_id in post/settings: `, user_id)
		if(!description){
			return res.status(400).json({message: 'Description is required'}) as any
		}		
		
		await handleAvatarGeneration(description, user_id)		
		
		return res.json({user,successMsg:'Successfully generated avatar'})
		
	} catch(error){
		if(error instanceof Error){
			console.log(error.message)
			return res.status(500).json({message: error.message}) as any
		}
	}
})

export default router