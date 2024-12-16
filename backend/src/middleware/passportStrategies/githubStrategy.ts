import 'dotenv/config'
require('dotenv').config()
import passport from 'passport'
import { Strategy as GitHubStrategy, Profile }  from 'passport-github2'
import { PassportStrategy } from '../../shared/interfaces/index'
import { addUser, getUserById, getUserByEmail,getUserByUname,getUserByUnameOrEmail } from '../../controllers/userController';
import { v5 as uuidv5 } from 'uuid';


if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
   throw new Error("Missing GitHub client ID or secret");
}

const githubStrategy: GitHubStrategy = new GitHubStrategy({
   clientID: process.env.GITHUB_CLIENT_ID,
   clientSecret: process.env.GITHUB_CLIENT_SECRET,
   callbackURL: "http://localhost:8000/auth/github/callback",
   passReqToCallback: true,
   scope: ['user:email']
}, async(req: Express.Request, accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<void> => {
  
   const email = profile.emails && profile.emails[0]?.value ? profile.emails[0].value : null;
   if (!email) {
      console.log("GitHub email not available.");
      return done(new Error("GitHub email not available"), false);
   }  	
   const avatar = profile.photos && profile.photos[0]?.value ? profile.photos[0].value : ''
   
   let githubUser:Express.User = {
      id:uuidv5(profile.id, uuidv5.URL), 		
      uname: profile.username as string,
      email: email,
		password:'',
      role: 'user',
      avatar: avatar
   }; 
  
   try {
      const getUser = await getUserByUnameOrEmail(githubUser.uname,email) as Express.User
      
      if(!getUser){
         console.log(`User not found. started to add the github user to database.`)
         await addUser(githubUser.uname,githubUser.email,githubUser.password,avatar)   
         const supabaseUser = await getUserByUname(githubUser.uname) as Express.User
         console.log(`supabaseUser @githubStrategy: `,supabaseUser)
         return done(null, supabaseUser);  
      } else {
         return done(null, getUser);
      }      
   } catch(error){
      if(error instanceof Error){
         console.error('Error in GitHubStrategy:', error.message)         
      }  
      return done(error)    
   }		
});

passport.serializeUser(function (user:Express.User,done: (err: any, id?: string) => void){
   console.log('github Serializing user:', user);
   console.log('github Serializing user with ID:', user.id); 
   done(null,user.id)
})

passport.deserializeUser(async(id:string,done: (err: any, user?: Express.User | false | null) => void)=>{
   try {
      
      let user = await getUserById(id) as Express.User
      console.log(`github user @deserializeUser: `, user)
      if (user){
         console.log(`github user inside deserializeUser: `, user)         
         done(null,user)
      } else {
         done({message: "User not found"},null)
      }
   }
   catch(error){
      if(error instanceof Error){
          console.error("GitHubStrategy Error:", error.message)          
      }
      return done(error)
   }   
}); 

const passportGitHubStrategy: PassportStrategy = {
   name:'github',
   strategy: githubStrategy
};
export default passportGitHubStrategy;