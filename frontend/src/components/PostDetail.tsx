
import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';

const PostDetail = ()=>{
	const location = useLocation();
	const post = location.state?.post
	console.log(`@PostDetail post: `,post)

	const [isCommentBtnVisible,setisCommentBtnVisible] = useState(false)

	const creatorName =
    typeof post.creator === "object" && post.creator?.uname
      ? post.creator.uname
      : "Unknown";
  return (
	 <div className="post-detail-container">
		<h1>Post Detail</h1>
		<div className="justify-content-between">
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
				>Comments(9)</button>
				{isCommentBtnVisible && (
					<div className="comments-area">
						<div className="comment-form">
							<form action="">
								<textarea name="comment" id="comment" 
								cols={30} rows={3} placeholder='Write a comment ...'></textarea>
								<button type="submit">Add Comment</button>
							</form>
						</div>
						<div className="comments-list">
							<div className="comment">
								<p>Comment 1</p>
								<p>Comment 2</p>
								<p>Comment 3</p>
							</div>
					 </div>
			     </div>
				)}	
			</div>
		</div>				
				
	 </div>
  )}

export default PostDetail;