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