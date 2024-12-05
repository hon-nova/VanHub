import { Post } from '../../../backend/src/shared/interfaces/index'
import { useParams } from 'react-router-dom'
import PostEdit from './PostEdit'

interface PostEditWrapperProps {
	posts: Post[];
	onEdit: (editedPost: Post)=>void
}
const PostEditWrapper: React.FC<PostEditWrapperProps> = ({posts,onEdit})=>{
	const { id } = Number(useParams<{id: number}>())
	const post = posts.find((post)=>post.id===id)
	if(!post){
		return <div>Post not found</div>
	}
	return <PostEdit post={post} onEdit={onEdit} />
}
export default PostEditWrapper