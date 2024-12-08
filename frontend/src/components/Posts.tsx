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
	const [user,setUser] = useState<User>()
	const [posts, setPosts ]= useState<Post[]>([])	
	
	const [isFormVisible,setIsFormVisible] = useState(false)
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

	const handleAddPost = (newPost:Post)=>{		
		setPosts((posts)=>[...posts,newPost])
		getPosts()
	}

	/** will revisit if delete */
	const handleEditPost = (updatedPost:Post)=>{
		setPosts((posts)=>({...posts, updatedPost}))
		getPosts()
	}
	const sendDeleteRequest = async (id:number)=>{
		try {
			const response = await fetch(`http://localhost:8000/public/posts/delete/${id}`, {
				method: "DELETE",
				credentials: "include",
			 })
			 const data = await response.json()
			 console.log(`data.post @sendDeleteRequest: `,data.successMsg)
			 setPosts((posts)=>{
				return posts.filter((p)=>p.id !== id)
			})
		} catch(error){
			if (error instanceof Error){
				console.error(`error @sendDeleteRequest: `,error.message)				
			}			
		}
	}
	const handleDelPost = async (id:number)=>{
		await sendDeleteRequest(id)
		getPosts()
	}
	return (
		<div className="posts-container">
			<Navbar user={user as User} handleLogout={handleLogout}/>				
			{msg.errorMsg && <div className="alert alert-danger text-center">{msg.errorMsg}</div>}
			{msg.successMsg && <div className="alert alert-success text-center">{msg.successMsg}</div>}	
			<div>
				<div className="my-5">
					{user && <h3>Welcome {user?.uname || "Guest"}</h3>}
					<div className="add-post-form">					
						<button  
							onClick={()=>setIsFormVisible((isVisible)=>!isVisible)}
							type="button" 
							className="mx-5 create-submit-btn">
								<i className="bi bi-plus-square mx-2"></i>{isFormVisible ? 'Hide Form':'Create Post'}
						</button>
						{isFormVisible && (						
							<div className="">
								<PostCreateItem onAdd={handleAddPost}/>
							</div>					
						)}										
					</div>	
				</div>
			</div>
			<div className="posts">									
				{/* all posts */}
				<ol>
				{posts && posts.map((p:Post,index)=>(
					<li key={index}><PostItem post={p} onDelete={(id)=>{handleDelPost(id)}} onEdit={(id)=>handleEditPost(p)} currentUser={user}/></li>
				))}
				</ol>
			</div>	
				{/* end all posts  */}
		</div>
	 )
}
export default Posts