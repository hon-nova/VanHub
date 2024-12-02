import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
const Posts = ()=>{
	const navigate = useNavigate();
	const [msg,setMsg] = useState('')

	const handleLogout = async () => {
		try {
			console.log(`handleLogout started`)
			const response = await fetch('http://localhost:8000/auth/logout', {
					method: 'POST',
					credentials: 'include', 
			  });

			  if (response.ok) {
				const data = await response.json();
				setMsg(data.message)
				setTimeout(() => {
					navigate('/auth/login');
				},3000)
					 
			  } else {
				const data = await response.json();
            console.error('Failed to log out:', data.message);
        }
		} catch (error) {
			  console.error('Error during logout:', error);
		}
	};
	 return (
		  <div className="container">
			{msg && <div className="alert alert-success text-center">{msg}</div>}
				<h1>All Posts live here ... </h1>
				<button onClick={handleLogout} className="btn btn-outline-danger">
                Logout
            </button>
		  </div>
	 )
}
export default Posts