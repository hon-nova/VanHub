import { Outlet, Link,useLocation,useNavigate } from 'react-router-dom';
import '../../../styles/css/profile-style.css'
import { Post, User } from '../../../../../backend/src/shared/interfaces/index'
import PostItem from '../../PostItem'
import { useState } from 'react';
// interface IPostProps {
// 	posts: Post[],
// 	user: User
// }
const Profile: React.FC<{posts:Post[],user:User}> = ({posts,user})=>{
	const location = useLocation()
	const navigate = useNavigate()
	const passedUser = location.state?.user
	const activeUser = passedUser || user

	const isSettings = location.pathname.includes("/user/profile/settings")
	// console.log(`posts in Profile: `, posts)
	// console.log(`user in Profile: `, user)
	const [msg,setMsg] = useState({
		errorMsg:'',
		successMsg:'',
		successComment:'',
		successDelComment:''
	})
	const handleLogout = async () => {
		try {
			console.log(`handleLogout started`)
			const response = await fetch('http://localhost:8000/auth/logout', {
					method: 'POST',
					credentials: 'include', 
			  });
			  const data = await response.json();
			  if (response.ok) {				
				setMsg((msgObj)=>({...msgObj, successMsg:data.successMsg}))
				setTimeout(() => {
					navigate('/auth/login');
				},2000)					 
			  } else {
				console.error('Failed to log out:', data.errorMsg);
				setMsg((msgObj)=>({...msgObj, errorMsg:data.errorMsg}))
		  }
		} catch (error) {
			  console.error('Error during logout:', error);
		}
	};
	return (
		<div className="profile-container">					
			<nav className="navbar navbar-expand-lg navbar-dark"
					style={{ backgroundColor: '#004a77' }}	>
				<div className="container-fluid">
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				{/* Navbar Content */}
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						{/* Profile Dropdown */}
						<li className="nav-item dropdown">
						<a className="nav-link dropdown-toggle"
							href="/user/profile"
							id="profileDropdown"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false" >
							{activeUser?.email}
						</a>
						<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">	
							<li>
								<Link className="dropdown-item" to="/user/profile" state={{ user }}>
								Profile
								</Link>
							</li>						
							<li>
								<Link className="dropdown-item" to="/user/profile/settings" state={{ user }}>
								Settings
								</Link>
							</li>
						</ul>
						</li>
						{/* Logout Button */}
						<li className="nav-item">
						<button
							onClick={handleLogout}
							className="btn btn-outline-danger ms-3">
							Logout
						</button>
						</li>
					</ul>
				</div>
				</div>
   		</nav>
			<main>
				<div className="profile-content">
					<h1>User Profile</h1>
					{activeUser.uname && <h5>Hello {activeUser.uname}</h5>}					
					<div className="row">
					<div className="col-md-3" style={{ backgroundColor:"pink" }}>
						 <div className="text-center">
						 	{/* <i className="bi bi-person-hearts"></i> */}
							<img src="https://via.placeholder.com/180" alt="profile" style={{borderRadius:"50%",marginTop: "5px"}}/>						
							 Profileavatar+email+uname
						 </div>
						<div className="text-end">
							<Link to="/user/profile/settings"><i className="bi bi-gear mx-1"></i>Settings</Link>
						</div>						
					</div>
					<div className="col-md-9"style={{ backgroundColor:"skyblue" }}>right
						{/* displaying all posts of this user here */}
						{isSettings ? ( <Outlet />) :(							
							posts && posts.map((post:Post)=>(
								<div key={post.id}>
									<PostItem post={post} currentUser={activeUser} onDelete={()=>{}} onEdit={()=>{}}/>
								</div>
							))
						)}						
					</div>
					</div>
				</div>
			</main>			
  </div>
	)
}
export default Profile;