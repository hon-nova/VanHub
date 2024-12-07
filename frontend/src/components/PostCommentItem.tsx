import { User, Comment } from '../../../backend/src/shared/interfaces/index'
// import { Comment } from '../../../backend/src/shared/interfaces/index'
interface PostCommentItemProps {
	comment: Comment;
	currentUser: User;
	onDelete: (id:number)=>void
}

const PostCommentItem: React.FC<PostCommentItemProps> = ({comment,currentUser,onDelete})=>{
	// const creatorName =
   //  typeof post.creator === "object" && post.creator?.uname
   //    ? post.creator.uname
   //    : "Unknown";
	const creatorName = 
		typeof comment.creator === "object" && comment.creator?.uname ? 
			comment.creator.uname : "Unknown"

	const isCommentor = creatorName === currentUser.uname
	return (
		<div className="comment">
			<div className="row my-2">
				<div className="col-md-9">
					<p>{comment.description}</p>
					<p style={{ color:"#00BCD4" }}>{creatorName}</p>
				</div>
				{isCommentor && (
					<div className="col-md-2">
							<button onClick={()=>onDelete(comment.id)}><i className="bi bi-trash"></i></button>
						</div>
				)}				
			</div>
		</div>
	)
}
export default PostCommentItem;