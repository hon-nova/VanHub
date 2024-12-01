import express from "express";
import session from "express-session";
import path from "path";
// import passportMiddleware from './middleware/passportMiddleware'
import bcrypt from 'bcrypt'
import client from './db/supabaseClient'
import cors from 'cors'

const saltValue =16
// const hash = bcrypt.hashSync('jessstephenson',saltValue)
// if(hash){
// 	console.log(`hash: `, hash)
// }

const port = process.env.PORT || 8000;

const app = express();
app.use(cors({
	origin: 'http://localhost:3000', 
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
      id: number,
      uname: string,
      email:string,
      password?:string,
      role:string
    }
  }
}
client.connect()
  .then(() => console.log('Connected to Supabase PostgreSQL'))
  .catch((err) => console.error('Error connecting to PostgreSQL:', err));
// (async()=>{	
// 	try {
// 		const email='jessstephenson@gmail.com'
// 		const stm = 'SELECT * FROM public.users WHERE email = $1';
// 		const result = await client.query(stm, [email]);
// 		console.log(`result:: `, result.rows[0])
// 	 } catch (err) {
// 		console.error('Error in Supabase query:', err);
// 	 }	
// })()

// import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";


// Middleware for express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// passportMiddleware(app);


// app.use((req, res, next) => {
//   console.log(`User details are: `);
//   console.log(req.user);
//   next();
// });

app.use("/", indexRoute);
// app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Social Media Server has started at http://localhost:${port}`);
});