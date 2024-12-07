
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import '../styles/css/post-detail-style.css';
import PostCommentItem from './PostCommentItem';
import { Comment } from '../../../backend/src/shared/interfaces/index'
import { get } from 'http';

const PostDetail = ()=>{
	const location = useLocation();
	const post = location.state?.post
	const user = location.state?.currentUser
	// console.log(`@PostDetail current user: `,user)

	const [isCommentBtnVisible,setisCommentBtnVisible] = useState(false)
	const [comment, setComment] = useState<Comment>({
		id:0,
		post_id:0,
		creator:'',
		description:'',
		timestamp:0
	})
	const [comments,setComments] = useState<Comment[]>([])
	const navigate = useNavigate();
	const [msg,setMsg] = useState({
		errorMsg:'',
		successMsg:'',
		successComment:'',
		successDelComment:''
	})
	const creatorName =
    typeof post.creator === "object" && post.creator?.uname
      ? post.creator.uname
      : "Unknown";

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
		const getComments = async (id:number)=>{
			///posts/show/:postid
			const response = await fetch(`http://localhost:8000/public/posts/show/${id}`,{
				method:'GET',
				credentials:'include'
			})
			const data = await response.json()
			if(response.ok){
				console.log(`@PostDetail getComments data: `,data.comments)
				setComments(data.comments)
			}
		}
		useEffect(()=>{
			getComments(post.id)
		},[post.id])
		
		const sendAddCommentRequest = async (id:number)=>{
			
			const response = await fetch(`http://localhost:8000/public/posts/comment-create/${id}`,{
				method:'POST',
				credentials:'include',
				headers:{
					'Content-Type':'application/json'
				},
				body:JSON.stringify({description: comment.description})
			})
			const data = await response.json()
			if(response.ok){
				console.log(`@PostDetail sendAddCommentRequest data: `,data)
				setComment(data.comment)				
				setMsg((msgObj)=>({...msgObj, successComment:data.successMsg}))

				setComment((comment)=>({...comment,description:''}))

				setTimeout(()=>{
					setMsg((msgObj)=>({...msgObj, successComment:''}))
				},2000)
				
			} else {
				console.log(`@PostDetail sendAddCommentRequest data: `,data.errorMsg)
				setMsg((msgObj)=>({...msgObj, errorMsg:data.errorMsg}))
				setTimeout(()=>{
					setMsg((msgObj)=>({...msgObj, errorMsg:''}))
				},3000)
			}
		}
		const handleAddComment = async (e:React.FormEvent<HTMLFormElement>,id:number)=>{
			e.preventDefault()
			await sendAddCommentRequest(id)
			getComments(id)
		}
		const handleDelComment  = async(id:number)=>{
			const response = await fetch(`http://localhost:8000/public/posts/comment-delete/${id}`,{				
				method:'DELETE',
				credentials:'include'
			})
			const data = await response.json()
			if(data.successMsg){
				setMsg((msgObj)=>({...msgObj, successDelComment:data.successMsg}))
				setTimeout(()=>{
					setMsg((msgObj)=>({...msgObj, successDelComment:''}))
				},2000)
				getComments(post.id)
			}
			if(data.errorMsg){
				setMsg((msgObj)=>({...msgObj, errorMsg:data.errorMsg}))
				setTimeout(()=>{
					setMsg((msgObj)=>({...msgObj, errorMsg:''}))
				},3000)
			}
		}
  return (
	 <div className="post-detail-container">
		<h1>Post Detail</h1>
		<div className="post-header d-flex justify-content-between">
			<h6>You are logged in as <span style={{ color:"#00BCD4" }}><b>{user?.uname}</b></span></h6>
			<button
                onClick={handleLogout}
                className="btn btn-outline-danger ms-3"
              >
                Logout
              </button>
		</div>
		{/* each post */}
		<div className="post-content justify-content-between">
			<div className="d-flex justify-content-between">
				<h2>{post?.title}</h2>			
				<div className="d-flex">
					<button className="mx-2" ><i className="bi bi-hand-thumbs-down" ></i></button>
					<button className="mx-2"><i className="bi bi-hand-thumbs-up"></i></button>
					<p>netVotes</p>
				</div>	
			</div>	
			<p><span style={{ color:"goldenrod" }}><b>{creatorName}</b></span> {post?.timestamp}</p>		
			<p>{post?.description}</p>
			<Link to={post?.link} target="_blank">Link</Link>
			<div className="comments">
				<button
				onClick={()=>setisCommentBtnVisible((isCommentBtnVisible)=>!isCommentBtnVisible)}	
				> <i className="bi bi-chat-dots mx-1"></i>Comments({comments.length})</button>
				{isCommentBtnVisible && (
					<div className="comments-area">
						{msg.errorMsg && <div className="text-warning text-center">{msg.errorMsg}</div>}
						{msg.successComment && <div className="text-success text-center">{msg.successComment}</div>}
						{msg.successDelComment && <div className="text-success text-center">{msg.successDelComment}</div>}
						{/* add comment */}
						<div className="comment-form">
							{/* /posts/comment-create/:postid */}
							<form action={`/public/posts/comment-create/${post.id}`} method="POST" onSubmit={(e)=>{handleAddComment(e,post.id)}}>
								<textarea name="description"
								onChange={(e)=>setComment((comment)=>({...comment,description:e.target.value}))}
								value={comment.description}
								id="description" 
								cols={30} rows={3} placeholder='Write a comment ...'></textarea>
								<button type="submit"><i className="bi bi-chat-dots mx-1"></i>Add Comment</button>
							</form>
						</div>
						{/* show all comments */}
						<div className="comments-list">							
								{comments && comments.map((comment:Comment)=>(
									<div className="comment" key={comment.id}>
										<PostCommentItem comment={comment} currentUser={user} onDelete={()=>{handleDelComment(comment.id)}} />
									</div>
								))}							
					 </div>
			     </div>
				)}	
			</div>
		</div>				
				
	 </div>
  )}

export default PostDetail;