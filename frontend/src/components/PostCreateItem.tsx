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
	
	const handleInputChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
		const {name,value} = e.target
		setFormData({
			...formData,
			[name]:value
		})
	}
	const submitAddRequest = async ()=>{
		try {
			const response = await fetch('http://localhost:8000/posts/add', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			 })
			 const data = await response.json()
			 console.log(`data.post @submitAddRequest: `,data.post)
			 onAdd(data.post)
			
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
		<h1>CREATE A POST FORM HERE</h1>
		<div className="post-create-container">
			<form action="/public/posts/add" method="POST" onSubmit={handleSubmitAdd}>
				<div>
					<label htmlFor="title">Title:</label>
					<input 
						onChange={(e)=>handleInputChange(e)}
						value={formData.title}
						type="text" id="title" name="title"/>
				</div>
				<div>
					<label htmlFor="link">Link:</label>
					<input 
						onChange={(e)=>handleInputChange(e)}
						value={formData.link}
						type="url" id="link" name="link"/>
				</div>
				<div>
					<label htmlFor="description">Description:</label>
					<textarea 
						onChange={(e)=>handleInputChange(e)}
						value={formData.description}
						id="description" name="description"></textarea>
				</div>				
				<div>
					<label htmlFor="subgroup">Subgroup:</label>
					<input 
						onChange={(e)=>handleInputChange(e)}
						value={formData.subgroup}
						type="text" id="subgroup" name="subgroup" required/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
		</>
	)
}

export default PostCreateItem