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
import { Post } from '../../backend/src/shared/interfaces/index';

function App() {
 
  const [post, setPost] = useState<Post>();
  
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
        <Route path="/public/posts/edit/:id" element={<PostEdit post={post} onEdit={handleEdit}/>} />
        <Route path="/public/posts/show/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
