import { Link, useNavigate } from 'react-router-dom';
import '../../styles/css/login-style.css';
import { useState } from 'react';

const Login =()=>{
	const navigate = useNavigate()
	const [formData,setFormData] = useState({
		email:'',
		password:''
	})
	const [msg,setMsg]= useState({
		errorLogin:'',
		errorPassword:'',
		successLogin:''
	})
	async function sendRequestLogin(){
		try {
			const response = await fetch('http://localhost:8000/auth/login',{
				method:"POST",				
				headers:{
					"Content-Type":"application/json"
				},
				body:JSON.stringify(formData),
				credentials: "include", 
			})
			const data = await response.json()
			console.log(`frontend data: `,data)
			
			if(data.errorLogin){
				console.log(`data.errorLogin: `, data.errorLogin)
				setMsg((msgObj)=>({...msgObj, errorLogin:data.errorLogin}))
				setTimeout(()=>{
					setMsg((msgObj)=>({...msgObj, errorLogin:''}))
				},3000)
			}
			if(data.errorEmail){
				console.log(`data.errorEmail: `, data.errorEmail)					
				setMsg((msgObj)=>({...msgObj, errorLogin:data.errorEmail}))
				setTimeout(()=>{
					setMsg((msgObj)=>({...msgObj, errorLogin:''}))
				},3000)
			}							
			//success
		if(data.successMsg){
			console.log(`data.successMsg: `, data.successMsg)
			setMsg((msgObj)=>({...msgObj, successLogin:data.successMsg}))
			if(data.isAdmin){
				setTimeout(()=>{
					navigate('/auth/admin')
				},1000)					
			} else {
				setTimeout(()=>{
					navigate('/public/posts')
				},1000)					
			}
			}
		} catch(error){
			console.error('Frontend Login Error: ',error)
		}
	}
	async function handleSubmitLogin(e:any){
		e.preventDefault()
		await sendRequestLogin()
	}
	const handleInputChange = (e:any) => {
		const {name,value} = e.target
		setFormData((formDataObj)=>({...formDataObj, [name]:value}))
	} 	
	function handleGitHubLogin(){
		window.location.href = 'http://localhost:8000/auth/github'
	}
	return (
		<div className="login-container">
			<h1>Login</h1>
			<div className="login-form">
				{msg.errorLogin && <p className="alert alert-danger">{msg.errorLogin}</p>}
				{msg.errorPassword && <p className="alert alert-danger">{msg.errorPassword}</p>}
				{msg.successLogin && <p className="alert alert-success">{msg.successLogin}</p>}
				<form action="/auth/login" method="POST" onSubmit={handleSubmitLogin}>					
					<div className="mt-5 mb-1">
						<label htmlFor="email" className="form-label">Email:</label>
						<input 
						onChange={(e)=>handleInputChange(e)}
						type="email" id="email" name="email" className="form-input"/>
					</div>
					<div className="my-1">
						<label htmlFor="password" className="form-label">Password:</label>
						<input 
						onChange={(e)=>handleInputChange(e)}
						type="password" id="password" name="password" className="form-input"/>
					</div>					
					<div className="my-2 form-btn">
						<button type="submit" className="login-btn">Login</button>						
					</div>
					<p>Forgot password? Reset <Link to="/auth/forgot">here</Link></p>				
				</form>
				<div className="login-btn">
					<p>Or</p> 
					<button
					onClick={handleGitHubLogin}
					className="btn btn-md btn-secondary">
						<i className="bi bi-github mx-2"></i>GitHub Login</button>		
				</div>
			</div>			
		</div>
	)
}
export default Login;