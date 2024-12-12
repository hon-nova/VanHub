import React, { useState } from 'react';
import { Post } from '../../../backend/src/shared/interfaces/index'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/css/post-edit-style.css'
import { usePosts } from '../context/PostsContext'


const PostEdit: React.FC = ()=>{
	const navigate = useNavigate()
	const location = useLocation()
	const { editPost } = usePosts()
	const passedPost = location.state?.post
	
	const [formData,setFormData]= useState({
		title:passedPost.title,
		link:passedPost.link,
		description:passedPost.description,
		subgroup:passedPost.subgroup
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
		const response = await fetch(`http://localhost:8000/public/posts/edit/${passedPost.id}`,{
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData),
			credentials:"include"
		})
		const data = await response.json()
		if(data.post){
			editPost(data.post)
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
			},2000)
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

		if (!formData.title || !formData.link || !formData.description) {
			setMsg((msgObj) => ({ ...msgObj, errorMsg: "Please fill out all required fields." }));
			return;
	  	}
		await submitEditRequest()
	}
	return (			
		<div className="post-edit-container">
			<div className="edit-form">
				{msg.successMsg && <h6 className="text-success">{msg.successMsg}</h6>}
				{msg.errorMsg && <h6 className="text-danger">{msg.errorMsg}</h6>}
				<form action={`/public/posts/edit/${passedPost.id}`} method="POST" onSubmit={handleSubmitEdit}>
				<div className="mt-5">
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
						style={{ height:"200px" }}>
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
				<div className="my-2 form-btn">
				<button type="submit" className="edit-btn">Save Changes</button>
				</div>				
			</form>
			</div>			
		</div>		
	)
}
export default PostEdit;