import React, {useEffect, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';  
import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Forgot from './components/Auth/Forgot';
import Admin from './components/Auth/Admin';
import Posts from './components/Posts';
import PostDetail from './components/PostDetail';
import PostEdit from './components/PostEdit';
import { Post, User } from '../../backend/src/shared/interfaces/index';
import Profile from './components/User/Profile/index';
import Settings from './components/User/Profile/settings';

function App() {
 
   const [post, setPost] = useState<Post>();
   const [posts,setPosts]= useState<Post[]>([])
   const [user,setUser] = useState<User>()
   
   const handleEdit = (editedPost: Post) => {
      setPost((post)=>({...post,...editedPost}))
   };
   const getPostsAndUser = async ()=>{
         const response = await fetch('http://localhost:8000/public/posts',{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
         });
         const data = await response.json()
         if(response.ok){
            setPosts(data.posts)
            setUser(data.user)
         }      
   }
   const postsUser = posts.filter((post:Post)=>post.creator ===  user?.id)
   
   useEffect(()=>{
      getPostsAndUser()
   },[])
   console.log(`postsUser: ${postsUser}`)
   console.log(`posts: `, posts)
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/auth/register" element={<Register />}/>
        <Route path="/auth/login" element={<Login />}/>
        <Route path="/auth/forgot" element={<Forgot />}/>
        <Route path="/auth/admin" element={<Admin />}/>       

        <Route path="/public/posts" element={<Posts />}/>
        <Route path="/public/posts/edit/:id" element={<PostEdit post={post} onEdit={handleEdit}/>} />
        <Route path="/public/posts/show/:id" element={<PostDetail />} />

        <Route path="/user/profile" element={<Profile posts={postsUser} user={user as User}/>} />
        <Route path="/user/profile/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
