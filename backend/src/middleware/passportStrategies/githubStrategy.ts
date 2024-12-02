import 'dotenv/config'
require('dotenv').config()
import { Strategy as GitHubStrategy, Profile }  from 'passport-github2'

import { PassportStrategy } from '../../shared/interfaces/index'
import { addUser } from '../../controllers/userController';
// import { User, database } from '../../models/userModel'

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
   // console.log(`accessToken: `, accessToken);
   console.log(`profile: `, profile);
   const email = profile.emails && profile.emails[0]?.value ? profile.emails[0].value : null;
   // console.log(`email:: `,email)
   if (!email) {
      console.log("GitHub email not available.");
      return done(new Error("GitHub email not available"), false);
   }  
   let githubUser:Express.User = {
      id: profile.id,
      uname: profile.displayName,
      email: email,
		password:'',
      role: 'user'
   };
   console.log(`githubUser: ${githubUser}`)
   // const foundUser = userModel.findUserById(githubUser.id)  
	await addUser(githubUser.uname,githubUser.email,githubUser.password)
   return done(null, githubUser);   
});

const passportGitHubStrategy: PassportStrategy = {
   name:'github',
   strategy: githubStrategy
};
export default passportGitHubStrategy;