import React, {useEffect, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';  
import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Forgot from './components/Auth/Forgot';
import Admin from './components/Auth/Admin';
import Posts from './components/Posts';
// import PostEditWrapper from './components/PostEditWrapper';
import PostEdit from './components/PostEdit';
import { Post } from '../../backend/src/shared/interfaces/index';

function App() {
 // const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post>();
  // const getPosts = async ()=>{
	// 	try {
	// 		const response = await fetch('http://localhost:8000/public/posts', {
	// 			method: "GET",
	// 			credentials: "include",
	// 		 })
	// 		 const data = await response.json()
	// 		 setPosts(data.posts)
			 
	// 	} catch(error){
	// 		console.error(`error public/posts @Posts: `,error)
	// 	}
	// }
	// useEffect(()=>{
	// 	getPosts()
	// },[])	  

  const handleEdit = (editedPost: Post) => {
    setPost((post)=>({...post,...editedPost}))
  };
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/auth/register" element={<Register />}/>
        <Route path="/auth/login" element={<Login />}/>
        <Route path="/auth/forgot" element={<Forgot />}/>
        <Route path="/auth/admin" element={<Admin />}/>       

        <Route path="/public/posts" element={<Posts />}/>
        {/* <Route path="/public/posts/edit/:id" element={<PostEditWrapper posts={posts} onEdit={handleEdit}/>} /> */}
        <Route path="/public/posts/edit/:id" element={<PostEdit post={post} onEdit={handleEdit}/>} />
      </Routes>
    </Router>
  );
}

export default App;
