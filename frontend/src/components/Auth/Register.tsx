import '../../styles/css/register-style.css'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Register = () => {
	const navigate = useNavigate()
	const [formData,setFormData] = useState({
		uname:'',
		email:'',
		password:'',
		confirmPassword:''
	})
	const [msg,setMsg]= useState({
		errorUname:'',
		errorEmail:'',
		errorUnmatchedPs:'',
		errorRegister:'',
		successRegister:''
	})
	
	async function sendRegister(){
		
		const { uname, email, password, confirmPassword } = formData
		if(uname === '' || email === '' || password === '' || confirmPassword === ''){
			setMsg((msgObj)=>({...msgObj, errorRegister:'Please fill in all fields'}))
			setTimeout(()=>{
				setMsg((msgObj)=>({...msgObj, errorRegister:''}))	
			},2000)
			return;
		}
		if(password !== confirmPassword){			
			setMsg((msgObj)=>({...msgObj, errorUnmatchedPs:'Passwords do not match'}))
			setTimeout(()=>{
				setMsg((msgObj)=>({...msgObj, errorUnmatchedPs:''}))	
			},2000)
			return;			
		}
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/auth/register`,{
				method:'POST',
				headers:{
					'Content-Type':'application/json'
				},
				body:JSON.stringify({uname, email, password})
			})
			const data = await response.json()
			console.log('Data:: ', data)
			if(data.errorUname){
				setMsg((msgObj)=>({...msgObj, errorUname:data.errorUname}))
				// setTimeout(()=>{
				// 	setMsg((msgObj)=>({...msgObj, errorUname:''}))	
				// },4000)
			}
			if(data.errorEmail){
				setMsg((msgObj)=>({...msgObj, errorEmail:data.errorEmail}))
				// setTimeout(()=>{
				// 	setMsg((msgObj)=>({...msgObj, errorEmail:''}))	
				// },4000)
			}
			if(data.errorRegister){
				setMsg((msgObj)=>({...msgObj, errorRegister:data.errorRegister}))
				setTimeout(()=>{
					setMsg((msgObj)=>({...msgObj, errorRegister:''}))	
				},2000)
			}
			if(data.successMsg){
				setMsg((msgObj)=>({...msgObj, successRegister:data.successMsg}))
				setFormData((formObj)=>({...formObj, uname:'', email:'', password:'', confirmPassword:''}))
				setTimeout(()=>{					
					navigate('/auth/login')	
				},2000)
			}	
			} catch(error){
				console.log('Error:: ', error)
			}		
	}
	async function handleSubmitRegister(e:any){
		e.preventDefault()
		await sendRegister()
	}
	function handleInputChange(e:any){
		e.preventDefault()
		const { name, value } = e.target as HTMLInputElement
		setFormData((formObj)=>({...formObj, [name]: value}))
	}
	return (
		<div className="register-container">
			<h1>Register</h1>
			<div className="register-form">
				{msg.errorRegister && <p className="text-danger">{msg.errorRegister}</p>}
				{msg.errorUnmatchedPs && <p className="text-danger">{msg.errorUnmatchedPs}</p>}
				{msg.errorUname && <p className="text-danger">{msg.errorUname}</p>}
				{msg.errorEmail && <p className="text-danger">{msg.errorEmail}</p>}
				{msg.successRegister && <p className="text-success">{msg.successRegister}</p>}
				<form action="/auth/register" method="POST" 
						onSubmit={handleSubmitRegister}>
					<div className="mt-5 mb-1">
						<label htmlFor="uname" className="form-label">Username:</label>
						<input 
						onChange={(e)=>handleInputChange(e)}
						type="text" id="uname" name="uname" className="form-input" />
					</div>
					<div className="my-1">
						<label htmlFor="email" className="form-label">Email:</label>
						<input 
						onChange={(e)=>handleInputChange(e)}
						type="email" id="email" name="email" className="form-input"/>
					</div>
					<div className="my-1">
						<label htmlFor="password" className="form-label">Password:</label>
						<input 
						onChange={(e)=>handleInputChange(e)}
						type="password" id="password" name="password" className="form-input"/>
					</div>
					<div className="my-1">
						<label htmlFor="confirmPassword" className="form-label">Re-type Password:</label>
						<input 
						onChange={(e)=>handleInputChange(e)}
						type="password" id="confirmPassword" name="confirmPassword" className="form-input"/>
					</div>
					<div className="my-2 form-btn">
						<button type="submit" className="register-btn">Register</button>						
					</div>
					<p>Already have an account? Login <Link to="/auth/login">here</Link></p>				
				</form>
			</div>			
		</div>
	)
}
export default Register
