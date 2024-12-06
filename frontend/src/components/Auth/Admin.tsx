import AdminNav from '../AdminNav'
import { User } from '../../../../backend/src/shared/interfaces/index'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Admin =()=>{
	const [user,setUser] = useState<User>()
	const navigate = useNavigate();
	const [msg,setMsg] = useState({
		errorMsg:'',
		successMsg:''
	})
	const getAdminInfo = async ()=>{
		try {
			const response = await fetch('http://localhost:8000/auth/admin', {
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
		<div className="admin-container">
			<div className="">
				<AdminNav user={user as User} handleLogout={handleLogout}/>
				{user && <h1>Hello {user?.uname}. You are logged in as {user?.email}</h1>	}
		</div>
		</div>
	)
}
export default Admin