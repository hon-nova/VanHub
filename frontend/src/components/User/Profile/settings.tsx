import { User } from '../../../../../backend/src/shared/interfaces/index'

import { useEffect, useState } from 'react';

interface IAvatar {
	gender: string;
	clothing: string;
	faceShape: string;
	hairColor: string;
	hairLength: string;
	skinColor: string;
 }
 
const Settings:React.FC<{user:User}> = ({user})=>{
	const [avatarObj, setAvatarObj] = useState<IAvatar>({
		gender: '',
		clothing: '',
		faceShape: '',
		hairColor: '',
		hairLength: '',
		skinColor: '',
	 });
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof IAvatar) => {
	setAvatarObj({ ...avatarObj, [field]: e.target.value });
	};
	 
	const handleGenerateAvatar = async () => {
		const description = `${avatarObj.gender}, ${avatarObj.clothing}, ${avatarObj.faceShape}, ${avatarObj.hairColor}, ${avatarObj.hairLength}, ${avatarObj.skinColor}`;
  
		if (!description) {
		  setError('Please enter a description!');
		  return;
		}  
		setLoading(true);
		setError(null);  
		try {
		   const response = await fetch('/api/generate-avatar', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ description }),
			});
	
			if (!response.ok) {
				throw new Error('Failed to generate avatar.');
			}  
			const data = await response.json();
			setAvatarUrl(data.avatarUrl);
		} catch (err: any) {
		  setError(err.message || 'Failed to generate avatar.');
		} finally {
		  setLoading(false);
		}
	};	
	return (
		<div>
		  <h2>Generate Your Avatar</h2>
		  <div>
			 <label>Gender:</label>
			 <input
				value={avatarObj.gender}
				onChange={(e) => handleChange(e, 'gender')}
				placeholder="Gender"
			 />
		  </div>
		  <div>
			 <label>Clothing:</label>
			 <input
				value={avatarObj.clothing}
				onChange={(e) => handleChange(e, 'clothing')}
				placeholder="Clothing"
			 />
		  </div>
		  <div>
			 <label>Face Shape:</label>
			 <input
				value={avatarObj.faceShape}
				onChange={(e) => handleChange(e, 'faceShape')}
				placeholder="Face Shape"
			 />
		  </div>
		  <div>
			 <label>Hair Color:</label>
			 <input
				value={avatarObj.hairColor}
				onChange={(e) => handleChange(e, 'hairColor')}
				placeholder="Hair Color"
			 />
		  </div>
		  <div>
			 <label>Hair Length:</label>
			 <input
				value={avatarObj.hairLength}
				onChange={(e) => handleChange(e, 'hairLength')}
				placeholder="Hair Length"
			 />
		  </div>
		  <div>
			 <label>Skin Color:</label>
			 <input
				value={avatarObj.skinColor}
				onChange={(e) => handleChange(e, 'skinColor')}
				placeholder="Skin Color"
			 />
		  </div>
		  <button onClick={handleGenerateAvatar} disabled={loading}>
			 {loading ? 'Generating...' : 'Generate Avatar'}
		  </button>
  
		  {error && <p style={{ color: 'red' }}>{error}</p>}
		  {avatarUrl && <img src={avatarUrl} alt="Generated Avatar" />}
		</div>
	 );
}
export default Settings;