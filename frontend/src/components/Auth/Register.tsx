const Register = () => {


	return (
		<div className="container">
			<h1>Register</h1>
			<form action="/auth/register" method="POST">
				<div>
					<label htmlFor="uname">Username:</label>
					<input type="text" id="uname" name="uname" required />
				</div>
				<div>
					<label htmlFor="email">Email:</label>
					<input type="email" id="email" name="email" required />
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input type="password" id="password" name="password" required />
				</div>
				<div>
					<label htmlFor="confirmPassword">Re-type Password:</label>
					<input type="password" id="confirmPassword" name="confirmPassword" required />
				</div>
				<div>
					<button type="submit">Register</button>
				</div>				
			</form>
		</div>
	)
}
export default Register
