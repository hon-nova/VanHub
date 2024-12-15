import "../styles/css/post-item-style.css";
import { Post, User } from "../../../backend/src/shared/interfaces/index";
import { Link } from "react-router-dom";

interface PostItemProps {
  post: Post;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  currentUser: User | undefined;
}
const PostItem: React.FC<PostItemProps> = ({ post, onEdit, onDelete, currentUser }) => {
  let hostname = "";
  try {
    hostname = new URL(post?.link).hostname || "N/A";
  } catch (error) {
    console.error(`error @PostItem: `, error);
  }
  const creatorName =
    typeof post.creator === "object" && post.creator?.uname
      ? post.creator.uname
      : "Unknown";
  const isCreator = creatorName === currentUser?.uname 
  const createrAvatar = typeof post.creator === "object" && post.creator?.avatar && post.creator?.avatar.trim() !== "" ? post.creator?.avatar:""

  return (
    <div className="d-flex justify-content-between post-item">
      <div>
        <span>
          <Link
            to={`/public/posts/show/${post.id}`}
            state={{ post,currentUser }}
            className="mx-2"><b>{post?.title}</b>
          </Link>
          ({hostname})
        </span>
        <span>
          <p>
          <img src={createrAvatar || 'https://example.com/default-avatar.png'} alt="creatorAvatar" id="creatorAvatar"/>
            <i>
              <span className="creator-name">{creatorName}</span> at {post?.timestamp}
            </i>
          </p>
        </span>
      </div>
      {isCreator && (
         <div className="edit-delete-post">
         <Link to={`/public/posts/edit/${post.id}`} state={{ post }} type="button"
           className="btn btn-outline-primary mx-2">
           <i className="bi bi-pencil mx-2"></i>
         </Link>
        
         <button
           type="button"
           className="btn btn-outline-primary"
           data-bs-toggle="modal"
           data-bs-target={`#deleteModal-${post.id}`}
         >
           <i className="bi bi-trash mx-2 text-danger"></i>
           
         </button>
        
         <div
           className="modal fade"
           id={`deleteModal-${post.id}`}
           data-bs-backdrop="static"
           data-bs-keyboard="false"
           aria-labelledby={`deleteModalLabel-${post.id}`}
           aria-hidden="true"
         >
           <div className="modal-dialog">
             <div className="modal-content">
               <div className="modal-header">
                 <h1
                   className="modal-title fs-5"
                   id={`deleteModalLabel-${post.id}`}
                 >
                   Are you sure you'd want to delete this post?
                 </h1>
                 <button
                   type="button"
                   className="btn-close"
                   data-bs-dismiss="modal"
                   aria-label="Close"
                 ></button>
               </div>              
               <div className="modal-footer">
                 <a
                   href={`/public/posts`}
                   type="button"
                   className="btn btn-secondary"
                   data-bs-dismiss="modal"
                 >
                   Cancel
                 </a>
                 <button
                   onClick={() => onDelete(post.id)}
                   type="button"
                   className="btn btn-danger"
                   data-bs-dismiss="modal"
                 >
                   Delete
                 </button>
               </div>
             </div>
           </div>
         </div>
        
       </div>
      )}
     
    </div>
  );
};
export default PostItem;
