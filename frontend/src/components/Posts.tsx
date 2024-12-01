import { Link, useNavigate } from 'react-router-dom'

const Posts = ()=>{
	const navigate = useNavigate();

	const handleLogout = async () => {
		 try {
			  const response = await fetch('http://localhost:8000/auth/logout', {
					method: 'POST',
					credentials: 'include', // Ensures cookies are sent with the request
					headers: { 'Content-Type': 'application/json' },
			  });

			  if (response.ok) {
					navigate('/'); // Redirect to login page after successful logout
			  } else {
					const data = await response.json();
					console.error('Logout error:', data.message);
			  }
		 } catch (error) {
			  console.error('Error during logout:', error);
		 }
	};
	 return (
		  <div>
				<h1>All Posts live here ... </h1>
				<button onClick={handleLogout} className="btn btn-danger">
                Logout
            </button>
		  </div>
	 )
}
export default Posts