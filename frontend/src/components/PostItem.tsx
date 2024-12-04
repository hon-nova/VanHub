type Post = {
	id: string,
	title:string,
	link:string,
	description:string,
	creator:string,
	subgroup: string,
	timestamp: number
}
interface PostItemProps {
	post: Post;
	onDelete: (id: string) => void;
	onEdit: (id: string) => void;

}
const PostItem: React.FC<PostItemProps> =({post,onEdit,onDelete})=>{
	return (
		<li className="post-item">
			<div>
				<h2>{post.title}</h2>
				<p>{post.description}</p>
				<a href={post.link} target="_blank" rel="noreferrer">Link</a>
			</div>
			<div>
				<button onClick={()=>onEdit(post.id)}>Edit</button>
				<button onClick={()=>onDelete(post.id)}>Delete</button>
			</div>
		</li>
	)
}
export default PostItem;