import '../../../styles/css/profile-post-item-style.css'
import { Post, User } from '../../../../../backend/src/shared/interfaces/index';
import { Link } from "react-router-dom";
import { useUser } from '../../../context/UserContext'

interface ProfilePostItemProps {
  post: Post;  
}
const ProfilePostItem: React.FC<ProfilePostItemProps> = ({ post }) => {
  const { user } = useUser()
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
  // const isCreator = creatorName === user?.uname 

  return (
    <div className="d-flex justify-content-between profile-post-item">
      <div>
        <span>
          <Link
            to={`/public/posts/show/${post.id}`}
            state={{ post }}
            className="mx-2"><b>{post?.title}</b>
          </Link>
          ({hostname})
        </span>
        <span>
          <p>            
            <i>
              <span className="">Posted </span> {post?.timestamp}
            </i>
          </p>
        </span>
      </div>     
    </div>
  );
};
export default ProfilePostItem;
