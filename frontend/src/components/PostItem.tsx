import '../styles/css/post-item-style.css'
import { Post } from '../../../backend/src/shared/interfaces/index'
import { Link } from 'react-router-dom'

interface PostItemProps {
	post: Post;
	onDelete: (id: number) => void;
	onEdit: (id: number) => void;

}
const PostItem: React.FC<PostItemProps> =({post,onEdit,onDelete})=>{
	let hostname =''
	try {
		hostname = new URL(post?.link).hostname || 'N/A'
	} catch(error){
		console.error(`error @PostItem: `,error)
	}
	return (
		<div className="d-flex justify-content-between post-item">
			<div>
				<span><a href={post?.link}  className="mx-2" target="_blank" rel="noreferrer"><b>{post?.title}</b></a>({hostname})</span>
				<span><p>By <i>{post?.creator} at {post?.timestamp}</i></p></span>
			</div>
			<div className="">				
				<Link 
					to={`/public/posts/edit/${post.id}`}
					state= {{ post }}><i className="bi bi-pencil mx-2"></i>Edit</Link>
				<button onClick={()=>onDelete(post.id)}><i className="bi bi-trash mx-2"></i>Delete</button>
			</div>
		</div>
	)
}
export default PostItem;