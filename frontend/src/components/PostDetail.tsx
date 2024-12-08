
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import '../styles/css/post-detail-style.css';
import PostCommentItem from './PostCommentItem';
import { Comment } from '../../../backend/src/shared/interfaces/index'


const PostDetail = ()=>{
	const location = useLocation();
	const post = location.state?.post
	const user = location.state?.currentUser
	const [activeVote, setActiveVote] = useState<null|number>(null)
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
	const [vote,setVote] =useState({
		setvoteto:0,
		currentNetVotes:0
	})
	const getNetVotesDb = async (id:number)=>{
		try {			
			const response = await fetch(`http://localhost:8000/public/posts/show/${id}`,{
				method:'GET',
				credentials:'include'
			})
			const data = await response.json()
			if(response.ok){
				console.log(`@PostDetail getNetVotesDb data: `,data)
				setVote((vote)=>({...vote,currentNetVotes:data.netVotesDb}))
			}
		} catch(error){
			if(error instanceof Error){
				console.error(`@PostDetail getNetVotesDb error: `,error.message)
			}			
		}
	}
	useEffect(()=>{
		getNetVotesDb(post.id)
	},[post.id])
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
				// console.log(`@PostDetail getComments data: `,data.comments)
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
		const handleVote = async (postId:number,value:number)=>{			
			const response = await fetch(`http://localhost:8000/public/posts/vote/${postId}`,{
				method:'POST',
				credentials:'include',
				headers:{
					'Content-Type':'application/json'
				},
				body:JSON.stringify({setvoteto:value})
			})
			const data = await response.json()
			console.log(`data from handleVote: `,data)
			if(response.ok){
				const updatedVote = data.setvoteto === 0 ? 0 : value; 
				setVote((prevVote) => ({
					...prevVote,
					currentNetVotes: data.netVotesDb, 
				}));
				setActiveVote(updatedVote);
			}
			
		}
  return (
	<div className="post-detail-container">
		<nav className="navbar navbar-expand-lg navbar-dark justify-content-end"
      		style={{ backgroundColor: '#004a77' }}>				  
				 <button
                onClick={handleLogout}
                className="btn btn-outline-danger ms-3 mx-2">
                Logout
              </button>
			</nav>
		<div className="post-header d-flex justify-content-between">
			<h6>You are logged in as <span style={{ color:"#00BCD4" }}><b>{user?.uname}</b></span></h6>			
		</div>
		{/* each post */}
		<div className="post-content justify-content-between">
			{/* votes */}
			<div className="d-flex justify-content-between">
				<h2>{post?.title}</h2>			
				<div className="d-flex">
					{/* /posts/vote/:postid/ */}					
					<button 
						type="submit"
						onClick={()=>handleVote(post.id,-1)}
						className="up-down-vote-btn"><i className={`bi bi-hand-thumbs-down ${activeVote ===-1 ?'btn-red':''}`}></i>
					</button>
					<button 
						type="submit"
						onClick={()=>handleVote(post.id,1)}
						className="up-down-vote-btn"><i className={`bi bi-hand-thumbs-up ${activeVote ===1 ?'btn-yellow':''}`}></i>
					</button>	
					<div className="netvotes-area">
						{vote.currentNetVotes && <p>{vote.currentNetVotes} </p>}		
					</div>									
								
				</div>	
			</div>	
			{/* end votes */}
			<p><span style={{ color:"goldenrod" }}><b>{creatorName}</b></span> {post?.timestamp}</p>		
			<p>{post?.description}</p>
			<Link to={post?.link} target="_blank"><i className="bi bi-link-45deg mx-1"></i>Link</Link>
			<div className="comments">
				<button
				onClick={()=>setisCommentBtnVisible((isCommentBtnVisible)=>!isCommentBtnVisible)}	
				className="view-add-comment"
				> <i className="bi bi-chat-dots mx-1"></i>View Comments({comments.length})</button>
				{isCommentBtnVisible && (
					<div className="comments-area">
						{msg.errorMsg && <div className="text-warning text-center">{msg.errorMsg}</div>}
						{msg.successComment && <div className="text-success text-center">{msg.successComment}</div>}
						{msg.successDelComment && <div className="text-success text-center">{msg.successDelComment}</div>}
						{/* add comment */}
						<div className="comment-form">
							{/* /posts/comment-create/:postid */}
							<form action={`/public/posts/comment-create/${post.id}`} method="POST" onSubmit={(e)=>{handleAddComment(e,post.id)}} className="comment-form-layer">
								<textarea name="description"
								onChange={(e)=>setComment((comment)=>({...comment,description:e.target.value}))}
								value={comment.description}
								className="description" 
								cols={30} rows={3} placeholder='Write a comment ...'></textarea>
								<button 
								type="submit"
								className="view-add-comment"><i className="bi bi-chat-dots mx-1"></i>Add Comment</button>
							</form>
						</div>
						{/* show all comments */}
						<div className="comments-list">							
							{comments && comments.map((comment:Comment)=>(
								<div className="comment-content" key={comment.id}>
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