import express, {Request, Response} from 'express'


const router = express.Router()

router.get('/', (req,res)=>{
	res.send('Welcome to Social Media Supabase App')
})


export default router