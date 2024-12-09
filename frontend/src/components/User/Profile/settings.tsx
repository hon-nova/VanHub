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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name,value } = e.target;
	setAvatarObj({ ...avatarObj, [name]: value});
	};
	 
	const handleGenerateAvatar = async () => {};	
	return (
		<div>
		   <h2>Generate Your Avatar</h2>
		   <div>
				<label>Gender:</label>
				<input
					name="gender"
					value={avatarObj.gender}
					onChange={(e) => handleChange(e)}
					placeholder="Gender"	/>
		  </div>
		  <div>
				<label>Clothing:</label>
				<input
					name="clothing"
					value={avatarObj.clothing}
					onChange={(e) => handleChange(e)}
					placeholder="Clothing"/>
		  </div>
		  <div>
				<label>Face Shape:</label>
				<input
					name="faceShape"
					value={avatarObj.faceShape}
					onChange={(e) => handleChange(e)}
					placeholder="Face Shape"/>
		  </div>
		  <div>
				<label>Hair Color:</label>
				<input
				name="hairColor"
					value={avatarObj.hairColor}
					onChange={(e) => handleChange(e)}
					placeholder="Hair Color" />
		  </div>
		  <div>
				<label>Hair Length:</label>
				<input
				name="hairLength"
					value={avatarObj.hairLength}
					onChange={(e) => handleChange(e)}
					placeholder="Hair Length" />
		  </div>
		  <div>
				<label>Skin Color:</label>
				<input
				name="skinColor"
					value={avatarObj.skinColor}
					onChange={(e) => handleChange(e)}
					placeholder="Skin Color" />
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