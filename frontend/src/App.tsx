import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';  
import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Forgot from './components/Auth/Forgot';
import Admin from './components/Auth/Admin';
import Posts from './components/Posts';
import PostEditWrapper from './components/PostEditWrapper';
import { Post } from '../../backend/src/shared/interfaces/index';

function App() {
  const [posts, setPosts] = React.useState<Post[]>([]);

  const handleEdit = (editedPost: Post) => {
    setPosts((posts) => posts.map((post) => post.id === editedPost.id ? editedPost : post));
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
        <Route path="/public/posts/edit/:id" element={<PostEditWrapper posts={posts} onEdit={handleEdit}/>} />
      </Routes>
    </Router>
  );
}

export default App;
