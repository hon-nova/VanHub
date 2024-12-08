import { Outlet, Link } from 'react-router-dom';
import '../../../styles/css/profile-style.css'
import { Post, User } from '../../../../../backend/src/shared/interfaces/index'
import PostItem from '../../PostItem'
interface IPostProps {
	posts: Post[],
	user: User
}
const Profile: React.FC<IPostProps> = ({posts,user})=>{
	return (
		<div className="profile-container">					
			<nav className="navbar navbar-expand-lg navbar-dark justify-content-end"
      		style={{ backgroundColor: '#004a77' }}>				  
				<Link to="/user/profile/settings">Settings</Link>
				<Link to="/auth/logout" className="btn btn-sm btn-outline-danger">Logout</Link>
			</nav>
			<main>
				<Outlet /> {/* Render child routes */}
				<div className="profile-content">
					<h1>User Profile</h1>
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
						{posts && posts.map((post:Post)=>(
							<div key={post.id}>
								<PostItem post={post} currentUser={user} onDelete={()=>{}} onEdit={()=>{}}/>
							</div>
						))}
					</div>
					</div>
				</div>
			</main>			
  </div>
	)
}
export default Profile;