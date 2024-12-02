import client from '../db/supabaseClient'
import { User } from '../shared/interfaces/index'
import bcrypt from 'bcrypt'

const saltValue =8

async function getUsers():Promise<Express.User[]>{
	try {		
		const stm = await client.query(`SELECT * FROM public.users`)
		const users = stm.rows
		// console.log(`users: `, users)
		if(!users){
			throw new Error(`Couldn't get users`)
		}
		return users ?? []
		// return users ?? [] //fallback to empty array if data is null
	} catch(error){
		if(error instanceof Error) {
			console.error('getUsers - Error in getting users: ',error.message)
		}		
		return []
	}
}
async function getUserById(userid:string):Promise<Express.User>{
	try {
		const stm = `SELECT * FROM public.users WHERE id=$1`
		const user = await client.query(stm,[userid])
		if(user.rowCount = 0){
			throw new Error(`Couldn't get user`)
		}
		return user.rows[0] ?? {} as User

	} catch(error){
		if(error instanceof Error) {
			console.error('getUserById - Error in getting user: ',error.message)
		}		
		return {} as User
	}
}
async function getUserByUname(uname:string):Promise<Express.User>{
	try {
		const stm = `SELECT * FROM public.users WHERE id=$1`
		const user = await client.query(stm,[uname])
		if(user.rowCount = 0){
			throw new Error(`Couldn't get user`)
		}
		return user.rows[0] ?? {} as User

	} catch(error){
		if(error instanceof Error) {
			console.error('getUserByUname - Error in getting user: ',error.message)
		}		
		return {} as User
	}
}
async function getUserByEmail(email:string):Promise<Express.User|null>{
	try {
		const stm = `SELECT * FROM public.users WHERE email=$1`
		const user = await client.query(stm,[email])
		if(user.rowCount === 0){
			throw new Error(`${email} doesn't exist`)
		}
		return user.rows[0]

	} catch(error){
		if(error instanceof Error) {
			console.error('getUserByEmail - Error in getting user: ',error.message)
		}		
		return null
	}
}

function isUserValid(user:User, password: string) {
	return bcrypt.compareSync(password,user.password)
}

async function getUserByEmailAndPassword(email:string,password:string):Promise<Express.User>{
	try {
		const user = await getUserByEmail(email)
		console.log('Retrieved user from getUserByEmailAndPassword:', user);

		if(!user || !user.password){
			throw new Error(`NO SUCH USER/EMAIL`)
		}
		
		const isPwdValid = bcrypt.compareSync(password,user.password)
		if(isPwdValid){
			return user as Express.User			
		} else {
			throw new Error(`Password is incorrect`)
		}
		
	} catch(error){
		if(error instanceof Error) {
			console.error('getUserByEmailAndPassword - Error in getting user: ',error.message)
		}		
		return {} as User
	}
}


async function resetPassword(info:string,newbarepassword:string):Promise<User>{
	try {
		//step 1: get user by info: email or uname
		const user = await getUserById(info) ?? await getUserByUname(info)
	
		const hashedPassword = bcrypt.hashSync(newbarepassword,saltValue)	
		//step 2: update user password
		const stm=`UPDATE public.users
						SET password=$1 
						WHERE id=$2`
		const data = await client.query(stm,[hashedPassword,user.id])
		if(data.rowCount = 0){
			throw new Error(`Couldn't reset password`)
		}
		return user ?? {} as User
	} catch(error){
		if(error instanceof Error) {
			console.error('resetPassword - Error in resetting password: ',error.message)
		}		
		return {} as User
	}
}
export { getUsers, getUserById, getUserByUname,resetPassword,getUserByEmailAndPassword,getUserByEmail, isUserValid }