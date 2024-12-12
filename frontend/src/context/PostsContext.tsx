import { Post } from '../../../backend/src/shared/interfaces/index'
import React, { createContext, useContext } from 'react'
import { useEffect, useState } from 'react'

interface PostsContextValue {
	posts: Post[],
	setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
	editPost: (updatedPost: Post) => void;
}
const PostsContext = createContext<PostsContextValue|undefined>(undefined)
export const PostsProvider: React.FC<{children:React.ReactNode}> = ({ children })=>{
	const [posts,setPosts] = useState<Post[]>([])	

	useEffect(()=>{
		const getPosts = async ()=>{
			try {
				const response = await fetch('http://localhost:8000/public/posts',{
					method: 'GET',
					credentials: 'include'
				})
				const data = await response.json()
				if(response.ok){
					console.log(`@App.tsx data.posts: `, data.posts)
					const sortedPosts = data.posts.sort((a:Post,b:Post)=>(a.id > b.id ? -1 : 1))	
					
					setPosts(sortedPosts)
					console.log(`sorted posts in PostsProvider: `, sortedPosts)
				} else {
					console.log(`@App.tsx posts statusText: `, response.statusText)
				}
			} catch (error) {
				console.error(`error @PostsProvider: `,error)
			}
		}
		getPosts()
	},[])
	const editPost = (passedPost:Post)=>{
		setPosts((prevPosts) =>
			prevPosts.map((post) => (post.id === passedPost.id ? { ...post, ...passedPost } : post))
		 );
	}
	
	return (
		<PostsContext.Provider value={{ posts,setPosts, editPost }}>
			{children}
		</PostsContext.Provider>
	)
}

export const usePosts =(): PostsContextValue => {
	const context = useContext(PostsContext)
	if(!context){
		throw new Error(`usePosts must be used within a UserProvider`)
	}
	return context
}