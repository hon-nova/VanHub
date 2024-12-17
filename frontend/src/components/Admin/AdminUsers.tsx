import '../../styles/css/admin-users-style.css'
import { User } from '../../../../backend/src/shared/interfaces/index'
import { useState, useEffect } from 'react'

const AdminUsers: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(()=>{
		const fetchUsers = async () => {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/admin/users`);
			const data = await response.json();
			console.log(`data.users: `,data.users)
			setUsers(data.users);
		};
		fetchUsers();	
	},[])
	return (
	  <div>
		 <h2 className="text-center my-4">User Management</h2>
		 {/* Display user-related content here */}
		 <table className="table table-striped">
			<tbody>
			{users && users.map((user:User)=>(
				<tr key={user.id}>
					<td>{user.id}</td>
					<td>{user.uname}</td>
					<td>{user.email}</td>
					<td><img src={user.avatar} width="60px" height="60px" alt="icon"/></td>
				</tr>
			))}
				
			</tbody>
		 </table>
		 

	  </div>
	);
 };
 
 export default AdminUsers;
 