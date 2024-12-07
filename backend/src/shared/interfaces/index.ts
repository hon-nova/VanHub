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
};
export type Post = {
	id: number,
	title:string,
	link:string,
	description:string,
	creator:string | User,
	subgroup: string,
	timestamp: number|null
};
export type Comment = {
	id: number,
	post_id:number,
	creator: string | User,
	description: string,
	timestamp: number | null
}
