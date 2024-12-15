import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import PostItem from './PostItem'
import PostCreateItem from './PostCreateItem'
import { Post,User } from '../../../backend/src/shared/interfaces/index'
import Navbar from './Navbar'
import '../styles/css/posts-style.css'
import { useUser } from '../context/UserContext'
import { usePosts } from '../context/PostsContext'

const Posts:React.FC = ()=>{
	const navigate = useNavigate();
	const [msg,setMsg] = useState({
		errorMsg:'',
		successMsg:''
	})
	const { user,setUser,loading } = useUser()
	let { posts, setPosts } = usePosts()
	const [isFormVisible,setIsFormVisible] = useState(false)	
	console.log(`user in Posts: `, user)		
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
            
				setMsg((msgObj)=>({...msgObj, errorMsg:data.errorMsg}))
        }
		} catch (error) {
			  console.error('Error during logout:', error);
		}
	};
	
	const handleAddPost = (newPost:Post)=>{		
		setPosts((preposts)=>(preposts ? [...preposts,newPost].sort((a,b)=>b.id -a.id) : [newPost]))	
		setUser(user)
		
	}
	const sendDeleteRequest = async (id:number)=>{
		try {	
			const response = await fetch(`http://localhost:8000/public/posts/delete/${id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			const data = await response.json();
			if(response.ok){
				
				setPosts((preposts)=>(preposts?.filter((post:Post)=>post.id !==id)||null))
				if(data.successMsg){
					setMsg((msgObj)=>({...msgObj, successMsg:data.successMsg}))
					setTimeout(()=>{
						setMsg((msgObj)=>({...msgObj, successMsg:''}))
					},2000)
				}
			
		} else {
			console.log(`FE error deleting post: `,response.statusText)
		}
		} catch(error:any){			
			console.error(`error deleting post: `,error)
			setMsg((msgObj)=>({...msgObj, errorMsg:error}))			
		}
	}

	const handleDelPost = async(id:number)=>{
		setUser(user)		
		await sendDeleteRequest(id)		
	}

	if(loading){
		return <div>Loading...</div>
	}

	return (
		<div className="posts-container">
			<Navbar user={user as User} handleLogout={handleLogout}/>				
			{msg.errorMsg && <div className="text-danger text-center">{msg.errorMsg}</div>}
			{msg.successMsg && <div className="text-success text-center">{msg.successMsg}</div>}	
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
					<li key={index}><PostItem post={p} onDelete={(id)=>{handleDelPost(id)}} onEdit={()=>{}} currentUser={user as User}/></li>
				))}
				</ol>
			</div>	
				{/* end all posts  */}
		</div>
	 )
}
export default Posts