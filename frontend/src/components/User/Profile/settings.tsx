import { User } from '../../../../../backend/src/shared/interfaces/index'
import '../../../styles/css/profile-settings-style.css'
import { useNavigate } from 'react-router-dom';


import { useState } from 'react';

interface ISettingsProps {
	user: User;
 }
const Settings:React.FC<ISettingsProps> = ({user})=>{		

	const [description, setDescription] = useState<string>('');	
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();
	const [msg, setMsg] = useState({
		errorMsg: '',
		succcessMsg:''
	});	
	const sendGenerateAvatarRequest = async () => {
		setLoading(true);
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
		   <h2>Generate Your Avatar</h2>
		   <div>			
				<i>Note: Your description should have a maximum of 1000 characters</i>	
				<form action="/user/profile/setting" method="POST" onSubmit={handleSubmitDescription}>
				{/* <label htmlFor="description">Generate Your Avatar</label> */}
					<textarea
						id="avatar-description"
						name="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Please describe your avatar ..."	/>
						<button 
						disabled={loading}>
								{loading ? 'Generating...' : 'Generate Avatar'}
						</button>
				</form>				
		  </div>  
		  {msg.errorMsg && <p style={{ color: 'red' }}>{msg.errorMsg}</p>}
		  {msg.succcessMsg && <p style={{ color: 'green' }}>{msg.succcessMsg}</p>}		 
		</div>
	 );
	}

export default Settings;