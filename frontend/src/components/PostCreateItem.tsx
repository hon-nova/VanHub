import React, { useState } from 'react';
import { Post } from '../../../backend/src/shared/interfaces/index'
import '../styles/css/post-create-style.css'

interface PostCreateItemProps {
	onAdd: (newPost:Post)=>void
}
const PostCreateItem: React.FC<PostCreateItemProps> = ({onAdd})=>{

	const [formData,setFormData]= useState({
		title:'',
		link:'',
		description:'',
		creator:'',
		subgroup:''
	})
	const [msg,setMsg] = useState({
		successMsg:'',
		errorMsg:''
	})
	
	const handleInputChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
		const {name,value} = e.target
		setFormData({
			...formData,
			[name]:value
		})
	}
	const submitAddRequest = async ()=>{
		try {
			const response = await fetch('http://localhost:8000/public/posts', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData),
				credentials:"include"
			 })
			const data = await response.json()
			if (!response.ok) {
				if (data.errorMsg) {
					setMsg((msgObj) => ({ ...msgObj, errorMsg: data.errorMsg }));
					setTimeout(() => {
						setMsg((msgObj) => ({ ...msgObj, errorMsg: '' }));
					}, 3000);
				}
				return;
			}
			
			onAdd(data.post)
			setFormData({
			title:'',
			link:'',
			description:'',
			creator:'',
			subgroup:''
			})
			if(data.successMsg){
				setMsg((msgObj)=>({...msgObj, successMsg:data.successMsg}))
				setTimeout(()=>{
					setMsg((msgObj)=>({...msgObj, successMsg:''}))
				},3000)
			}			
		} catch(error){
			console.error(`error @submitAddRequest: `,error)
		}
	}
	const handleSubmitAdd = async (e:React.FormEvent<HTMLFormElement>)=>{
		e.preventDefault()
		await submitAddRequest()
	}
	
	return (
		<>		
		<div className="post-create-container">
			<div>
				{msg.successMsg && <h6 className="text-success">{msg.successMsg}</h6>}
				{msg.errorMsg && <h6 className="text-danger">{msg.errorMsg}</h6>}
			</div>
			<form action="/public/posts" method="POST" onSubmit={handleSubmitAdd}>
				<div>
					<label htmlFor="title" className="form-label">Title:</label>
					<input 
						onChange={(e)=>handleInputChange(e)}
						value={formData.title}
						type="text" id="title" name="title"
						className="form-input mt-2"/>
				</div>
				<div>
					<label htmlFor="link" className="form-label">Link:</label>
					<input 
						onChange={(e)=>handleInputChange(e)}
						value={formData.link}
						type="url" id="link" name="link"
						className="form-input"/>
				</div>
				<div>
					<label htmlFor="description" className="form-label">Description:</label>
					<textarea 
						onChange={(e)=>handleInputChange(e)}
						value={formData.description}
						id="description" name="description"
						className="form-input"
						></textarea>
				</div>				
				<div>
					<label htmlFor="subgroup" className="form-label">Subgroup:</label>
					<input 
						onChange={(e)=>handleInputChange(e)}
						value={formData.subgroup}
						type="text" id="subgroup" name="subgroup"
						className="form-input"/>
				</div>
				<button 				 	
					type="submit" id="create-submit-btn"><i className="bi bi-send mx-1"></i>Submit</button>
			</form>
		</div>
		</>
	)
}

export default PostCreateItem