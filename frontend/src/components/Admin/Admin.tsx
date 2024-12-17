import AdminNav from './AdminNav'
import '../../styles/css/admin-style.css'
import { User } from '../../../../backend/src/shared/interfaces/index'
import { useEffect, useState } from 'react'
import { useNavigate, Link, Outlet } from 'react-router-dom'

const Admin =()=>{
	const [user,setUser] = useState<User>()
	const navigate = useNavigate();
	const [msg,setMsg] = useState({
		errorMsg:'',
		successMsg:''
	})
	const getAdminInfo = async ()=>{
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/admin`, {
				method: "GET",
				credentials: "include",
				
			 })
			 const data = await response.json()
			 setUser(data.adminUser)
		} catch(error){
			console.error(`error admin @Admin: `,error)
		}
	}
	useEffect(()=>{
		getAdminInfo()
	},[])
	const handleLogout = async () => {
		try {
			console.log(`handleLogout started`)
			const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/logout`, {
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
		<div className="admin-container">
			<div className="">
				<AdminNav user={user as User} handleLogout={handleLogout}/>
				{user && <h3>Hello {user?.uname}</h3>	}
			</div>
			<div className="row row-decorated">
				<div className="col-md-3 left-panel">
					<ul>
						<li className="users-posts"><i className="bi bi-people-fill mx-2"></i><Link to="/auth/admin/users">Users</Link></li>
						<li className="users-posts"><i className="bi bi-chat-quote mx-2"></i><Link to="/auth/admin/posts">Posts</Link></li>
					</ul>
				</div>
				<div className="col-md-9 right-body">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
export default Admin