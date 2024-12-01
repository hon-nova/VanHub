import express, { Request, Response, NextFunction} from 'express'


export const ensureAuthenticated = (
	req: Request, res: Response, next: NextFunction
) => {
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/auth/login')
}

export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction)=>{
	if(!req.isAuthenticated()){
		return next()
	}
	res.redirect('dashboard')
}

// export const isAdmin = (req: Request) =>{
// 	if(req.user){
// 		const thisUser = req.user as Express.User
// 		return thisUser.role === 'admin'
// 	}
// }