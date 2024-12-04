import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { getUserByEmailAndPassword, getUserById,isUserValid, getUserByEmail } from "../../controllers/userController"
import { PassportStrategy } from '../../shared/interfaces/index'
import bcrypt from 'bcrypt'

const localStrategy = new LocalStrategy({
   usernameField: "email",
   passwordField:"password",
   
},
 async (email,password,done)=>{
   try {
      const user = await getUserByEmail(email)
      console.log(`user @localStrategy: `, user)
      if(!user){      
         return done(null, false, { message: `Couldn't find user with email: ${email}` });
      } 
      const isPwdValid = bcrypt.compareSync(password,user.password)
      if(!isPwdValid){
         return done(null, false, { message: "Password is incorrect!!" });
      }
      return done(null,user)
   } catch(error){
      if(error instanceof Error){
          console.error("LocalStrategy Error:", error.message)          
      }
      return done(error)      
   }  
})

passport.serializeUser(function (user:Express.User,done: (err: any, id?: string) => void){
   console.log('Serializing user:', user);
   console.log('Serializing user with ID:', user.id); 
   done(null,user.id)
})

passport.deserializeUser(async(id:string,done: (err: any, user?: Express.User | false | null) => void)=>{
   try {
      // console.log(`DESERIALIZEUSER GOT TRIGGERED at last`)
      let user = await getUserById(id) as Express.User
      // console.log(`user @deserializeUser: `, user)
      if (user){
         console.log(`user inside user deserializeUser: `, user)         
         done(null,user)
      } else {
         done({message: "User not found"},null)
      }
   }
   catch(error){
      if(error instanceof Error){
          console.error("LocalStrategy Error:", error.message)          
      }
      return done(error)
   }
   
});

(async()=>{
   passport.serializeUser(function (user:Express.User,done: (err: any, id?: string) => void){
      console.log('Serializing user:', user);
      done(null,user.id)
   })
   passport.deserializeUser(async function(id:string,done: (err: any, user?: Express.User | false | null) => void){
      console.log('Deserializing user with ID:', id);
      let user = await getUserById(id)
      console.log(`user @deserializeUser: `, user)
      if (user){
         console.log(`user inside user: `, user)
         done(null,user)
      } else {
         done({message: "User not found"},null)
      }
   });
})()
const passportLocalStrategy: PassportStrategy = {
   name:"local",
   strategy: localStrategy
}


export default passportLocalStrategy