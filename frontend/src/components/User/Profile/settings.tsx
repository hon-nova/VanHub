import { User } from '../../../../../backend/src/shared/interfaces/index'
import '../../../styles/css/profile-settings-style.css'

import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Settings:React.FC=()=>{

	const [description, setDescription] = useState<string>('');	
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();
	const location = useLocation();
	const stateUser = location.state?.user
	console.log(`stateUser in settings: `, stateUser)	
	const [msg, setMsg] = useState({
		errorMsg: '',
		succcessMsg:''
	});	

	const sendGenerateAvatarRequest = async () => {
		setLoading(true);
		console.log('Sending description:', description);  
		try {
			const response = await fetch('http://localhost:8000/user/profile/settings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials:'include',
				body	: JSON.stringify({description})		
			})	
			if (!response.ok) {
				throw new Error('Something went wrong');
			}
			const data = await response.json();
			setLoading(false)
			setMsg({ ...msg, succcessMsg: data.successMsg });
			setTimeout(()=>{
				navigate('/user/profile')
			},2000)
		} catch (error) {
			if (error instanceof Error) {
				setMsg({ ...msg, errorMsg: error.message });
			}
		}
	}
	const handleSubmitDescription = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await sendGenerateAvatarRequest()
	}
	return (
		<div>
		   <h2>Welcome <span style={{ color:"pink" }}>{stateUser && stateUser.uname}</span> - Generate Your Avatar</h2>
		   <div className="avatar">			
				<p className="my-3"><i >Note: Your description should have a maximum of 1000 characters</i></p>
				<form action="/user/profile/setting" method="POST" onSubmit={handleSubmitDescription}>
					<textarea
						id="avatar-description"
						name="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Please describe your avatar ..."	/>
						<button 
						disabled={loading} className="avatar-btn">
								{loading ? 'Generating...' : 'Generate Avatar'}
						</button>
				</form>
				<i><i className="bi bi-exclamation-circle mx-2" style={{ color:"#ecc043" }}></i><span style={{color:"gray"}}>You would need to sign out and log back in to see your avatar updated.</span></i>				
		  </div>  
		  {msg.errorMsg && <p style={{ color: 'red' }}>{msg.errorMsg}</p>}
		  {msg.succcessMsg && <p style={{ color: 'green' }}>{msg.succcessMsg}</p>}		 
		</div>
	 );
	}

export default Settings;