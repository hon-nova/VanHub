import { Link } from 'react-router-dom';

const Home = ()=>{
	 return (
		  <div>
				<nav className="navbar navbar-expand-lg navbar-dark"
      			style={{ backgroundColor: '#004a77' }}>
					<ul className="d-flex justify-content-between">
						<li><Link to="/auth/login">Login</Link></li>
						<li className="mx-3"><Link to="/auth/register">Register</Link></li>
					</ul>
				</nav>
				<h1>Welcome to Social Media Supabase App!</h1>
		  </div>
	 )
}
export default Home;