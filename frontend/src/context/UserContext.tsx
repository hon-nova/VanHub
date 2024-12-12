import { User } from '../../../backend/src/shared/interfaces/index'
import React, { createContext, useContext } from 'react'
import { useEffect, useState } from 'react'

interface UserContextValue {
	user: User|null,
	setUser: React.Dispatch<React.SetStateAction<User|null>>
}
const UserContext = createContext<UserContextValue|undefined>(undefined)
// console.log(`@App.tsx React.ReactNode: `, React.ReactNode)
export const UserProvider: React.FC<{children:React.ReactNode}> = ({ children })=>{
	const [user,setUser] = useState<User|null>(null)
	

	useEffect(()=>{
		const getUser = async ()=>{
			try {
				const response = await fetch('http://localhost:8000/public/posts',{
					method: 'GET',
					credentials: 'include'
				})
				const data = await response.json()
				if(response.ok){
					// console.log(`@App.tsx data.user: `, data.user)
					setUser(data.user)
				} else {
					console.log(`@App.tsx statusText: `, response.statusText)
				}
			} catch (error) {
				console.error(`error @UserProvider: `,error)
			}
		}
		getUser()
	},[])
	return (
		<UserContext.Provider value={{ user,setUser }}>
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