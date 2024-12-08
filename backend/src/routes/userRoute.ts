import express, {Request, Response} from 'express'
import passport from 'passport'
import path from 'path'
import fs from 'fs'

const router = express.Router()

router.get('/', (req,res)=>{
	res.send('User Profile Route')
})

router.get('/settings', (req,res)=>{
	res.send('User Profile Settings Route')
})


export default router