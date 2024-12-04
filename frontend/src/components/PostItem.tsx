import '../styles/css/post-item-style.css'
import { Post } from '../../../backend/src/shared/interfaces/index'

interface PostItemProps {
	post: Post;
	onDelete: (id: string) => void;
	onEdit: (id: string) => void;

}
const PostItem: React.FC<PostItemProps> =({post,onEdit,onDelete})=>{
	
	return (
		<div className="d-flex justify-content-between post-item">
			<div>
				<span><a href={post.link}  className="mx-2" target="_blank" rel="noreferrer"><b>{post.title}</b></a>({new URL(post.link).hostname})</span>
				<span><p>By <i>{post.creator} at {post.timestamp}</i></p></span>
			</div>
			<div className="">
				<button onClick={()=>onEdit(post.id)} className="mx-2"><i className="bi bi-pencil mx-2"></i>Edit</button>
				<button onClick={()=>onDelete(post.id)}><i className="bi bi-trash mx-2"></i>Delete</button>
			</div>
		</div>
	)
}
export default PostItem;