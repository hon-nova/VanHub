import express, {Request, Response} from 'express'
import passport from 'passport'
import path from 'path'
import fs from 'fs'
import { updateUser,uploadAvatarFromUrl } from '../controllers/userController'

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
		const user_id = (req.user as Express.User)?.id 
		console.log(`user_id in post/settings: `, user_id)
		//db: ac4c9fe6-2652-4612-888a-d5f014d20381

		// console.log(`user_id in post/settings: `, user_id)
		if(!description){
			return res.status(400).json({message: 'Description is required'}) as any
		}
		
		const image = await openai.images.generate({ 
			model: "dall-e-2", 
			prompt: `${description}`,
			size: "256x256",			
			style:"natural"});	
		// console.log(image.data.data[0].url);
		const imageUrl = image.data[0].url
		if(!imageUrl){
			throw new Error(`Backend failed to generate avatar. Please try again.`)
		}
	
		const avatarPath = await uploadAvatarFromUrl(user_id,imageUrl)
		const updatedUser = await updateUser(user_id,{ avatar: avatarPath})
		if(!updatedUser){
			console.log(`no user updated`)
			throw new Error(`Couldn't update user with their avatar`)
		}
		console.log(`user updated`)
		console.log(`avatar path: `)
		console.log(avatarPath)
		return res.json({user:updatedUser,successMsg:'Successfully generated avatar'})
		
	} catch(error){
		if(error instanceof Error){
			console.log(error.message)
			return res.status(500).json({message: error.message}) as any
		}
	}
})

export default router