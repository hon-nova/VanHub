import express from "express";
import session from "express-session";
import path from "path";
import passportMiddleware from './middleware/passportMiddleware'
import bcrypt from 'bcrypt'
import client from './db/supabaseClient'
import cors from 'cors'
import { getUsers, getUserById, getUserByUname, getUserByEmail,getUserByEmailAndPassword,resetPassword } from "./controllers/userController";

const saltValue =8
// const hash = bcrypt.hashSync('adminadmin',saltValue)
// if(hash){
// 	console.log(`hash: `, hash)
// }

const port = process.env.PORT || 8000;

const app = express();
app.use(cors({
	origin: 'http://localhost:3000', 
  credentials: true
 }));

app.use(
  session({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

declare global{
  namespace Express {
    interface User {
      id: string,
      uname: string,
      email:string,
      password:string,
      role:string
    }
  }
}
client.connect()
  .then(() => console.log('Connected to Supabase PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));
(async()=>{	
	try {
      // const {data,error} = await client.from('public.users').select()
      const users = await getUsers()
      // console.log(`users @app: `, users)
      const uniqueUser = await getUserById('4be98560-c532-437c-9f29-54c75d30a228')
      // console.log(`user @app: `, uniqueUser)
      // const userByEmail = await getUserByEmail('jimmy123fdfdsfdsfsa@gmail.com')
      // console.log(`user by email @app: `, userByEmail)
      // const userEmailPwd = await getUserByEmailAndPassword('jimmy123@gmail.com','ji')
      // console.log(`userEmailPwd by email @app: `, userEmailPwd)
      // const userReset = await resetPassword('jimmy123@gmail.com','newpassword')
      // console.log(`userReset: `, userReset)
    } catch (err) {
      console.error('Error in Supabase query:', err);
    }	
})()

import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";

// Middleware for express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//crucial for Passport.js in this app
passportMiddleware(app);


// app.use((req, res, next) => {
//   console.log(`User details are: `);
//   console.log(req.user);
//   next();
// });

app.use("/", indexRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Social Media Server has started at http://localhost:${port}`);
});