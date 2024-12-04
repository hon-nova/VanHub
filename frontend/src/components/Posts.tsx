import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PostItem from './PostItem'
import PostCreateItem from './PostCreateItem'
import { Post,User } from '../../../backend/src/shared/interfaces/index'
import Navbar from './Navbar'
import '../styles/css/posts-style.css'

const Posts = ()=>{
	const navigate = useNavigate();
	const [msg,setMsg] = useState({
		errorMsg:'',
		successMsg:''
	})
	const [posts, setPosts ]= useState<Post[]>([])
	const [user,setUser] = useState<User>()
	const getPosts = async ()=>{
		try {
			const response = await fetch('http://localhost:8000/public/posts', {
				method: "GET",
				credentials: "include",
			 })
			 const data = await response.json()
			 setPosts(data.posts)
			 setUser(data.user)
		} catch(error){
			console.error(`error public/posts @Posts: `,error)
		}
	}
	useEffect(()=>{
		getPosts()
	},[])	 
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
		  <div className="posts-container">
				<Navbar user={user as User} handleLogout={handleLogout}/>				
				{msg.errorMsg && <div className="alert alert-danger text-center">{msg.errorMsg}</div>}
				{msg.successMsg && <div className="alert alert-success text-center">{msg.successMsg}</div>}		
				<div className="add-post-form">
					<PostCreateItem onAdd={()=>{}}/>
				</div>	
				<div className="posts">All Posts live here ...
					{/* <h3>Welcome {{ username }}</h3> */}
					{user && <h3>Welcome {user?.uname || "Guest"}</h3>}
					<ol>
					{posts && posts.map((p:Post)=>(
						<li><PostItem key={p.id} post={p} onDelete={()=>{}} onEdit={()=>{}}/></li>
					))}
					</ol>
				</div>				
		  </div>
	 )
}
export default Posts