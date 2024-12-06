import React, { useState } from 'react';
import { Post } from '../../../backend/src/shared/interfaces/index'
import { useNavigate, useLocation } from 'react-router-dom'

interface PostEditProps {
	post?:Post;
	onEdit: (editedPost:Post)=>void
}
const PostEdit: React.FC<PostEditProps> = ({post,onEdit})=>{
	const location = useLocation()
	const passedPost = location.state?.post
	console.log(`passedPost @PostEdit: `,passedPost)
	const effectivePost = passedPost || post

	const navigate = useNavigate()
	const [formData,setFormData]= useState({
		title:effectivePost.title,
		link:effectivePost.link,
		description:effectivePost.description,
		subgroup:effectivePost.subgroup
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
	const submitEditRequest =  async()=>{
		const response = await fetch(`http://localhost:8000/public/posts/edit/${effectivePost.id}`,{
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData),
			credentials:"include"
		})
		const data = await response.json()
		if(data.post){
			onEdit(data.post)
			setFormData({
				title:'',
				link:'',
				description:'',
				subgroup:''
			})
		}
		if(data.successMsg){
			setMsg((msgObj)=>({...msgObj, successMsg:data.successMsg}))
			setTimeout(()=>{
				navigate('/public/posts')
			},3000)
		}
		if(data.errorMsg){
			setMsg((msgObj)=>({...msgObj, errorMsg:data.errorMsg}))
			setTimeout(()=>{
				setMsg((msgObj)=>({...msgObj, errorMsg:''}))
			},3000)
		}
	}
	const handleSubmitEdit = async (e:React.FormEvent<HTMLFormElement>)=>{
		e.preventDefault()
		await submitEditRequest()
	}
	return (
		<>		
		<div className="post-edit-container">
			<div>
				{msg.successMsg && <h6 className="text-success">{msg.successMsg}</h6>}
				{msg.errorMsg && <h6 className="text-danger">{msg.errorMsg}</h6>}
			</div>
			<form action={`/public/posts/edit/${effectivePost.id}`} method="POST" onSubmit={handleSubmitEdit}>
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
						style={{ height:"200" }}>
					</textarea>
				</div>				
				<div>
					<label htmlFor="subgroup" className="form-label">Subgroup:</label>
					<input 
						onChange={(e)=>handleInputChange(e)}
						value={formData.subgroup}
						type="text" id="subgroup" name="subgroup"
						className="form-input"/>
				</div>
				<button type="submit">Save Changes</button>
			</form>
		</div>
		</>
	)
}
export default PostEdit;