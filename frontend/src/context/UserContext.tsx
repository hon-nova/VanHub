import { User } from '../../../backend/src/shared/interfaces/index'
import React, { createContext, useContext } from 'react'
import { useEffect, useState } from 'react'

interface UserContextValue {
	user: User,
	setUser: React.Dispatch<React.SetStateAction<User>>,
	loading: boolean
}
const defaultUser: User = {
	id: '',
   uname: '',
   email: '',
   password: '',
   role: '',
	avatar:''
};
const UserContext = createContext<UserContextValue|undefined>(undefined)
export const UserProvider: React.FC<{children:React.ReactNode}> = ({ children })=>{
	
	const [user,setUser] = useState<User>(defaultUser)	
	const [loading, setLoading] = useState(true);
	useEffect(()=>{
		const getUser = async ()=>{
			try {
				const response = await fetch('http://localhost:8000/public/posts',{
					method: 'GET',
					credentials: 'include'
				})
				const data = await response.json()
				if(response.ok){
					
					setUser(data.user)
				} else {
					console.log(`@App.tsx statusText: `, response.statusText)
				}
			} catch (error) {
				console.error(`error @UserProvider: `,error)
			} finally {
				setLoading(false)
			}
		}
		getUser()
	},[])
	return (
		<UserContext.Provider value={{ user,setUser,loading }}>
			{children}
		</UserContext.Provider>
	)
}

export const useUser =(): UserContextValue => {
	const context = useContext(UserContext)
	if(!context){
		throw new Error(`useUser must be used within a UserProvider`)
	}
	return context
}