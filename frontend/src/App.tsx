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
import Profile from './components/User/Profile';
import Settings from './components/User/Profile/settings';
import ProfilePostItem from './components/User/Profile/ProfilePostItem'
import { UserProvider} from './context/UserContext';
import { PostsProvider} from './context/PostsContext';

function App() { 
  
   const [selectedPost, setSelectedPost] = useState<Post | null>(null);
   const templatePost: Post = {
      id: -1,
      title: 'Default Title',
      link: 'http://localhost:3000',
      description: 'Default Description',
      subgroup: 'Default Subgroup',
      creator: { id: '',
         uname: '',
         email: '',
         password: '',
         role: '',
         avatar:''},
      timestamp: 0,
    };
   return (
   <UserProvider>
      <PostsProvider>
         <Router>
            <Routes>
               <Route path="/" element={<Home />}/>
               <Route path="/auth/register" element={<Register />}/>
               <Route path="/auth/login" element={<Login />}/>
               <Route path="/auth/forgot" element={<Forgot />}/>
               <Route path="/auth/admin" element={<Admin />}/>       

               <Route path="/public/posts" element={<Posts />}/>
               <Route path="/public/posts/edit/:id" element={<PostEdit />} />
               <Route path="/public/posts/show/:id" element={<PostDetail />} />

               <Route path="/user/profile" element={<ProfilePostItem post={ selectedPost||templatePost }/>}  />
               {/* <Route path="/user/profile/" element={<Profile posts={posts as Post[]} user={user as User}/>}>
                  <Route path="settings" element={<Settings user={user as User}/>} />
               </Route>         */}
            </Routes>
         </Router>
      </PostsProvider>      
   </UserProvider>  
  );
}

export default App;
