import { Link } from 'react-router-dom';
import '../../styles/css/login-style.css';
import { useState } from 'react';
const Login =()=>{

	const [formData,setFormData] = useState({
		email:'',
		password:''
	})
	const [msg,setMsg]= useState({
		errorLogin:'',
		errorPassword:'',
		successLogin:''
	})
	const handleInputChange = (e:any) => {
		const {name,value} = e.target
		setFormData({...formData, [name]:value})
	}
	
	return (
		<div className="login-container">
			<h1>Login</h1>
			<div className="login-form">
				{msg.errorLogin && <p className="alert alert-danger">{msg.errorLogin}</p>}
				{msg.errorPassword && <p className="alert alert-danger">{msg.errorPassword}</p>}
				<form action="/auth/login" method="POST">					
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
			</div>
			
		</div>
	)
}
export default Login;