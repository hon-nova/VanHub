import { Outlet, Link,useLocation,useNavigate } from 'react-router-dom';
import '../../../styles/css/profile-style.css'
import { Post, User } from '../../../../../backend/src/shared/interfaces/index'
import ProfilePostItem from '../../User/Profile/ProfilePostItem'
import { useState, useEffect } from 'react';
import  { useUser }  from '../../../context/UserContext'
import { usePosts }  from '../../../context/PostsContext'

const Profile: React.FC = ()=>{
	const location = useLocation()
	const navigate = useNavigate()
	const { user,setUser } = useUser()
		
	console.log(`user from root: `, user)
	console.log(`user from state: `, location.state?.user)
	const stateUser = location.state?.user || user
	console.log(`stateUser from Nav: `, stateUser)
	const { posts } = usePosts()
	const isSettings = location.pathname.includes("/user/profile/settings")

	const postsUser = posts.filter((post: Post) => (post.creator as User)?.id === stateUser.id)
	console.log(`postsUser: `, postsUser)
	const [msg,setMsg] = useState({
		errorMsg:'',
		successMsg:'',
		
	})
	useEffect(() => {
		if (user && user.avatar) {
		  setUser(user);
		}
	 }, [user]);
	 
	const handleLogout = async () => {
		try {
			console.log(`handleLogout started`)
			const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/logout`, {
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
				
				<div className="collapse navbar-collapse" id="navbarNav">
				<ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
            <li className="nav-item">
              <a className="nav-link" href="/public/posts">
                Home
              </a>
            </li>            
          </ul>
					<ul className="navbar-nav ms-auto">
						
						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle"
								href="/user/profile"
								id="profileDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false" >
								{stateUser?.email}
							</a>
						<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">	
							<li>
								<Link className="dropdown-item" to="/user/profile">
								Profile
								</Link>
							</li>						
						</ul>
						</li>
						
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
				<div className="profile-content my-4">
					{stateUser.uname && <h5>You're logging in as <span style={{ color:"pink" }}>{stateUser.uname}</span> </h5>}					
					<div className="row" style={{ margin:"auto",height:"100vh",justifyContent:"center" }}>
					<div className="col-md-3" style={{ backgroundColor:"pink" }}>					 
						<div className="text-center">							
							{stateUser.avatar && (
								<img								
								src={stateUser.avatar}
								alt="profile"
								style={{ borderRadius: "50%", marginTop: "5px", width: "150px", height: "150px" }}
								/>
							)}							
							<div>
								<p>{stateUser.email}</p>
								<p>Logged-in username: {stateUser.uname}</p>
							</div>
  						</div>						
						<div className="text-end">
							<Link to="/user/profile/settings" state={{ user:stateUser }}><i className="bi bi-gear mx-1"></i>Settings</Link>
						</div>						
					</div>
					<div className="col-md-9">
					{isSettings ? (
							<Outlet />
						) : (
							postsUser && postsUser.length > 0 && (
								postsUser.map((post: Post) => (
								<div key={post.id}>
									<ProfilePostItem post={post}  />
								</div>
								))
							) 
						)}			
					</div>
					</div>
				</div>
			</main>			
  </div>
	)
}
export default Profile;