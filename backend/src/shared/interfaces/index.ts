import { Strategy } from 'passport'

export interface PassportStrategy {
   name: string,
   strategy: Strategy
}
export interface User {
   id: string,
   uname: string,
   email: string,
   password: string,
   role: string
}
export type Post = {
	id: string,
	title:string,
	link:string,
	description:string,
	creator:string,
	subgroup: string,
	timestamp: number
}
