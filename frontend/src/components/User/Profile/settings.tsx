import { User } from '../../../../../backend/src/shared/interfaces/index'

const Settings:React.FC<{user:User}> = ({user})=>{
	return (
		<div>
			<h1>Profile Settings</h1>
		</div>
	)
}
export default Settings;