import express, {Request, Response} from 'express'
import passport from 'passport'
import path from 'path'
import fs from 'fs'

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
	
	return
})

router.post('/settings', async (req,res)=>{
	try {
		//req.body here
		const { description } = req.body
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
		return res.json({avatar:image.data})
		
	} catch(error){
		if(error instanceof Error){
			console.log(error.message)
		}
	}
})

export default router