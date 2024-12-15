import express, {Request, Response} from 'express'

import { handleAvatarGeneration, readAvatarsFromDisk,uploadAvatarToSupabase } from '../controllers/userController'


import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()

router.get('/', async (req:Request,res:Response)=>{

	const user = (req.user as Express.User)
	const user_id = user.id
	const updatedUser = await readAvatarsFromDisk(user_id)

	if(!updatedUser){
			throw new Error("BACKEND: User'\s avatar cannot get updated")
		}		

	return res.json({user:updatedUser}) as any
})

router.post('/settings', async (req,res)=>{
	try {
		const { description } = req.body
		const user = req.user as Express.User
		const user_id = user.id 
		
		if(!description){
			return res.status(400).json({message: 'Description is required'}) as any
		}			
		await handleAvatarGeneration(description, user_id)					
		const updatedUser = await uploadAvatarToSupabase(user_id)		
		return res.json({user,successMsg:'Successfully generated avatar'})
		
	} catch(error){
		if(error instanceof Error){
			console.log(error.message)
			return res.status(500).json({message: error.message}) as any
		}
	}
})

export default router