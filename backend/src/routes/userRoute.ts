import express, {Request, Response} from 'express'
import passport from 'passport'
import path from 'path'
import fs from 'fs'
import { updateUser } from '../controllers/userController'

// import Colors from '../utils/color.js'
import dotenv from 'dotenv'
dotenv.config()


// console.log(`open_ai_key in userRoute: `, process.env.OPEN_AI_KEY)
const router = express.Router()

router.get('/', (req,res)=>{
	res.send('User Profile Route')
})
import OpenAI from 'openai'
import readline from 'readline'
import { fileURLToPath } from 'url';


const openai = new OpenAI({ apiKey: process.env.OPEN_ACCESS_KEY });


router.get('/settings', async (req,res)=>{
	const user = (req.user as Express.User)
	console.log(`user in get/settings: `, user)
	return res.json({user}) as any
})

router.post('/settings', async (req,res)=>{
	try {
		//req.body here
		const { description } = req.body
		const user_id = (req.user as Express.User)?.id
		console.log(`user_id in post/settings: `, user_id)
		if(!description){
			return res.status(400).json({message: 'Description is required'}) as any
		}
		//Note: the description max-text-length is 1000 characters
		const image = await openai.images.generate({ 
			model: "dall-e-2", 
			prompt: `${description}`,
			size: "256x256",			
			style:"natural"});	
		// console.log(image.data.data[0].url);
		const avatar = image.data[0].url
		const updatedUser = await updateUser(user_id,{ avatar})
		if(!updatedUser){
			throw new Error(`Couldn't update user with their avatar`)
		}
		console.log(`avatar generated: `)
		console.log(avatar)
		return res.json({user:updatedUser,successMsg:'Successfully generated avatar'})
		
	} catch(error){
		if(error instanceof Error){
			console.log(error.message)
			return res.status(500).json({message: error.message}) as any
		}
	}
})

export default router