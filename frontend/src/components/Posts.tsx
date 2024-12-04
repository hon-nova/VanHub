import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'


const Posts = ()=>{
	const navigate = useNavigate();
	const [msg,setMsg] = useState({
		errorMsg:'',
		successMsg:''
	})
	const getPosts = async ()=>{
		try {
			const response = await fetch('http://localhost:8000/public/posts', {
				method: "GET",
				credentials: "include",
			 })
			 const data = await response.json()
			 
			 console.log(`data public/posts @Posts: `,data)
		} catch(error){
			console.error(`error public/posts @Posts: `,error)
		}
	}
	useEffect(()=>{
		getPosts()
	},[])
	 
	const handleLogout = async () => {
		try {
			console.log(`handleLogout started`)
			const response = await fetch('http://localhost:8000/auth/logout', {
					method: 'POST',
					credentials: 'include', 
			  });
			  const data = await response.json();
			  if (response.ok) {				
				setMsg((msgObj)=>({...msgObj, successMsg:data.successMsg}))
				setTimeout(() => {
					navigate('/auth/login');
				},2000)					 
			  } else {
            console.error('Failed to log out:', data.errorMsg);
				setMsg((msgObj)=>({...msgObj, errorMsg:data.errorMsg}))
        }
		} catch (error) {
			  console.error('Error during logout:', error);
		}
	};
	return (
		  <div className="container">
			{msg.errorMsg && <div className="alert alert-danger text-center">{msg.errorMsg}</div>}
			{msg.successMsg && <div className="alert alert-success text-center">{msg.successMsg}</div>}
				<h1>All Posts live here ... </h1>
				<button onClick={handleLogout} className="btn btn-outline-danger">
                Logout
            </button>
		  </div>
	 )
}
export default Posts