import express from "express";
import session from "express-session";
import path from "path";
import passportMiddleware from './middleware/passportMiddleware'
import bcrypt from 'bcrypt'
import client from './db/supabaseClient'
import cors from 'cors'
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
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
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  })
);
//crucial for Passport.js in this app
passportMiddleware(app);

// Middleware for express
app.use((req, res, next) => { 
  if (req.session && (req.session as any).passport && (req.session as any).passport.user) {
    console.log('Session exists @app:', (req.session as any).passport.user);
  } else {
    console.log('No session found');
  }
  console.log('passport.user @app:', ((req.session as any).passport?.user));
  next();
});

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

import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";
import postRoute from "./routes/postRoute";
import userRoute from "./routes/userRoute";

// app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/public", postRoute);
app.use("/user/profile", userRoute);

(async()=>{
  //important
  // console.log(req.user); // Outputs: [object Object]
  // console.log(req.session); // Outputs: [object Object]

})()
app.listen(port, () => {
  console.log(`🚀 Social Media Server has started at http://localhost:${port}`);
});