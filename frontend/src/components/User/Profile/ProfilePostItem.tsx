import '../../../styles/css/profile-post-item-style.css'
import { Post, User } from '../../../../../backend/src/shared/interfaces/index';
import { Link } from "react-router-dom";

interface ProfilePostItemProps {
  post: Post;
  currentUser: User | undefined;
}
const ProfilePostItem: React.FC<ProfilePostItemProps> = ({ post, currentUser }) => {
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

  return (
    <div className="d-flex justify-content-between profile-post-item">
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
            <i>
              <span className="">Posted </span> at {post?.timestamp}
            </i>
          </p>
        </span>
      </div>     
    </div>
  );
};
export default ProfilePostItem;
