import { User } from '../../../../../backend/src/shared/interfaces/index'
import { createAvatar } from '@dicebear/core';
// import { lorelei,adventurer,females,males } from '@dicebear/collection';
import * as dicebear from '@dicebear/collection';
import { useEffect, useState } from 'react';

const Settings:React.FC<{user:User}> = ({user})=>{
	

	// const avatar = createAvatar(adventurer, {
	// seed: 'John Doe',
	
	// });

	// const svgCode = avatar.toString();
	// console.log(`svgCode: `, svgCode)
	const [svgCode, setSvgCode] = useState<string>('');

  useEffect(() => {
    // Customize options for the avatar
    const avatar = createAvatar(dicebear.female, {
      seed: 'hon-nguyen', // You can use a unique identifier to get a consistent avatar
      // backgroundColor: '#6c63ff', // Set a custom background color
      eyes: 'happy', // Customize eyes
      hair: 'short', // You can customize hair type or color
      skin: 'light', // Customize skin tone
      accessories: ['glasses', 'earrings'], // You can add accessories
    });

    setSvgCode(avatar.toString());
  }, []);
	return (
		<div>
			<h1>Profile Settings</h1>
			{/* <img src="" */}
			{/* <div dangerouslySetInnerHTML={{ __html: svgCode }} style={{width:"180px",height:"180px"}}/> */}
		</div>
	)
}
export default Settings;