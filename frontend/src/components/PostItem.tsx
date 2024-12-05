import "../styles/css/post-item-style.css";
import { Post } from "../../../backend/src/shared/interfaces/index";
import { Link } from "react-router-dom";

interface PostItemProps {
  post: Post;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}
const PostItem: React.FC<PostItemProps> = ({ post, onEdit, onDelete }) => {
  let hostname = "";
  try {
    hostname = new URL(post?.link).hostname || "N/A";
  } catch (error) {
    console.error(`error @PostItem: `, error);
  }
  return (
    <div className="d-flex justify-content-between post-item">
      <div>
        <span>
          <a
            href={post?.link}
            className="mx-2"
            target="_blank"
            rel="noreferrer"
          >
            <b>{post?.title}</b>
          </a>
          ({hostname})
        </span>
        <span>
          <p>
            By{" "}
            <i>
              {post?.creator} at {post?.timestamp}
            </i>
          </p>
        </span>
      </div>
      <div className="">
        <Link to={`/public/posts/edit/${post.id}`} state={{ post }}>
          <i className="bi bi-pencil mx-2"></i>Edit
        </Link>
        {/* button to trigger the modal */}
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#deleteModal-${post.id}`}
        >
          <i className="bi bi-trash mx-2"></i>
          Delete
        </button>
        {/* Modal */}
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
        {/* end modal */}
      </div>
    </div>
  );
};
export default PostItem;
