import { Link } from 'react-router-dom';
import '../../styles/css/login-style.css';

const Login =()=>{
	return (
		<div className="login-container">
			<h1>Login</h1>
			<div className="login-form">
				<form action="/auth/login" method="POST">					
					<div className="mt-5 mb-1">
						<label htmlFor="email" className="form-label">Email:</label>
						<input type="email" id="email" name="email" className="form-input"/>
					</div>
					<div className="my-1">
						<label htmlFor="password" className="form-label">Password:</label>
						<input type="password" id="password" name="password" className="form-input"/>
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