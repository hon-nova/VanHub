import 'dotenv/config'
require('dotenv').config()
import { Strategy as GitHubStrategy, Profile }  from 'passport-github2'
import { PassportStrategy } from '../../shared/interfaces/index'
import { addUser, getUserByEmail,getUserByUname,getUserByUnameOrEmail } from '../../controllers/userController';
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
},
async(req: Express.Request, accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<void> => {
   
   const email = profile.emails && profile.emails[0]?.value ? profile.emails[0].value : null;
   if (!email) {
      console.log("GitHub email not available.");
      return done(new Error("GitHub email not available"), false);
   }  
	
   let githubUser:Express.User = {
      id:uuidv5(profile.id, uuidv5.URL), 		
      uname: profile.username as string,
      email: email,
		password:'',
      role: 'user'
   }; 
	const getUser = await getUserByUnameOrEmail(githubUser.uname,email) as Express.User
   // console.log('githubStrategy getUser:',getUser)

	if(!getUser){
		await addUser(githubUser.uname,githubUser.email,githubUser.password)     
	}
	return done(null, githubUser); 	
});

const passportGitHubStrategy: PassportStrategy = {
   name:'github',
   strategy: githubStrategy
};
export default passportGitHubStrategy;