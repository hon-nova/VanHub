import { Link } from 'react-router-dom';
import '../styles/css/home-style.css'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const Home = () => {
	const privacyTooltip = (
		<Tooltip id="privacy-tooltip">
		  This author encourages respectful communication. Let's keep the conversation positive and inclusive! 
		</Tooltip>
	 );
  return (
    <div className="home-container">     
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#004a77' }}>
         <ul className="d-flex justify-content-between">
				<li className="nav-li mx-2">
					<img src="/images/logo3.jpg" alt="VanHub Logo" id="logo"/>
				</li>
				<li className="nav-li"><Link to="/auth/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
				</li>         
        </ul>
      </nav>     
      <header className="text-center my-4">
        <h1>Welcome to VanHub!</h1>
        <h5>Your story, your voice, your hub.</h5>
      </header>
     
      <div className="container mt-5" style={{ width:"80%" }}>
			<section className="row my-4 each-section" >
				<div className="col-md-5 text-center">
					<img src="/images/image1.jpg" alt="Why Social Media" width="300px" height="300px" className="home-image" />
				</div>
				<div className="col-md-5 right-content">
					<h3 id="h3">Why do we need a social media website?</h3>
					<p id="p">To connect with like-minded individuals, share ideas, and foster meaningful interactions in a digital age.</p>
				</div>
			</section>
		  <hr />
			<section className="row my-4 each-section">
				<div className="col-md-5 text-center">
					<img src="/images/image22.jpg" alt="Share Your Voice" className="home-image" />
				</div>
				<div className="col-md-5 right-content">
					<h3 id="h3">Empower Voices</h3>
					<p id="p">VanHub is your platform to share stories, inspire others, and create a ripple effect of positivity.</p>
				</div>
			</section>
		  <hr />
			<section className="row my-4 each-section">
				<div className="col-md-5 text-center">
					<img src="/images/image3.jpg" alt="Build Community" className="home-image" />
				</div>
				<div className="col-md-5 right-content">
					<h3 id="h3">Build Communities</h3>
					<p id="p">From local networks to global connections, VanHub fosters communities that grow together.</p>
				</div>
			</section>
      </div>
     
      <div className="text-center my-5">
			<h2>Let’s Connect Now!</h2>
			<div className="ln-btn d-flex justify-content-center align-items-center m-auto">
					<Link to="/auth/register" id="ln-link">Get Started</Link>
			</div>       
      </div>

      <footer className="footer mt-5 py-4 text-center" style={{ 			backgroundColor: '#004a77', color: '#fff' }}>
        <div className="footer-content">
				<h6>Your story matters. Share it with the world.</h6>
				<div className="footer-links">
				<OverlayTrigger
					placement="top"
					overlay={privacyTooltip} >          
					<a href="#" style={{ color: '#fff', textDecoration: 'underline' }}>Privacy Policy</a>
					</OverlayTrigger>
					<span> | </span>
					<a href="mailto:hon.x.code@gmail.com" style={{ color: '#fff', textDecoration: 'underline' }}>Contact Us</a>
				</div>
				<h6>Developed and maintained by <a href="https://linkedin.com/in/hon-nguyen" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Hon Nguyen</a></h6>
				<h6>&copy; 2024 VanHub. All rights reserved.</h6>
        </div>
      </footer>
    </div>
  );
};

export default Home;
