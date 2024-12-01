import express, {Request, Response} from 'express'
import passport from 'passport'
import path from 'path'
import fs from 'fs'

const router = express.Router()

router.get('/', (req,res)=>{
	res.send('Welcome to Social Media Supabase App')
})



export default router