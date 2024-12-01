// import passport from 'passport'
// import { Strategy as LocalStrategy } from 'passport-local'
// import { getUserByEmail, getUserById,isUserValid } from "../../controllers/userController"
// import { PassportStrategy } from '../../interfaces/index'


// const localStrategy = new LocalStrategy({
//    usernameField: "email",
//    passwordField:"password",
   
// },
// (email,password,done)=>{
//    const user = getUserByEmail(email)
//    if(!user){      
//       return done(null, false, { message: `Couldn't find user with email: ${email}` });
//    } 
//    if (!isUserValid(user,password)){
//       return done(null, false, { message: "Password is incorrect" });
//    }
//    return done(null,user)
// }
// )
// passport.serializeUser(function (user:Express.User,done: (err: any, id?: number) => void){
//    done(null,user.id)
// })

// passport.deserializeUser(function(id:number,done: (err: any, user?: Express.User | false | null) => void){
//    let user = getUserById(id)
//    if (user){
//       done(null,user)
//    } else {
//       done({message: "User not found"},null)
//    }
// });
// const passportLocalStrategy: PassportStrategy = {
//    name:"local",
//    strategy: localStrategy
// }
// export default passportLocalStrategy