import '../../styles/css/register-style.css'
import { Link } from 'react-router-dom'

const Register = () => {


	return (
		<div className="register-container">
			<h1>Register</h1>
			<div className="register-form">
				<form action="/auth/register" method="POST">
					<div className="mt-5 mb-1">
						<label htmlFor="uname" className="form-label">Username:</label>
						<input type="text" id="uname" name="uname" className="form-input" />
					</div>
					<div className="my-1">
						<label htmlFor="email" className="form-label">Email:</label>
						<input type="email" id="email" name="email" className="form-input"/>
					</div>
					<div className="my-1">
						<label htmlFor="password" className="form-label">Password:</label>
						<input type="password" id="password" name="password" className="form-input"/>
					</div>
					<div className="my-1">
						<label htmlFor="confirmPassword" className="form-label">Re-type Password:</label>
						<input type="password" id="confirmPassword" name="confirmPassword" className="form-input"/>
					</div>
					<div className="my-2 form-btn">
						<button type="submit" className="register-btn">Register</button>
						
					</div>
					<p>Already have an account? Login <Link to="/auth/login">here</Link></p>				
				</form>
			</div>
			
		</div>
	)
}
export default Register
