import '../../styles/css/admin-posts-style.css'
import React, { useEffect, useState } from 'react';
import  { Bar }  from 'react-chartjs-2';
import { Post }  from '../../../../backend/src/shared/interfaces/index'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
 } from 'chart.js';
 // Register the necessary components for the chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const AdminPosts: React.FC = ()=>{
	const [posObj, setPosObj] = useState<any>({
		posts:[],
		percentagePositive:0,
		percentagePCS:0
	});
	const [negObj, setNegObj] = useState<any>({
		posts:[],
		percentageNegative:0,
		percentageNCS:0
	})
	const [neuObj, setNeuObj] = useState<any>({
		posts:[],
		percentageNeutral:0,
		percentageNeutralCS:0
	})
	const [chartData, setChartData] = useState<any>();
	const [posts, setPosts] = useState<any[]>([])
	console.log(`posts in AdminPosts: `,posts)
	const [selectedSentiment, setSelectedSentiment] = useState<string>('positive');	
	const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
	
	useEffect(() => {
		const fetchSentimentData = async () => {
			const response = await fetch('http://localhost:8000/auth/admin/posts', {
				method: 'GET',
				credentials: 'include',
			})
			const data = await response.json()
			console.log(`data: `,data)		 
		   setPosObj(data.pos)
			setNegObj(data.neg)
			setNeuObj(data.neu) 
			setPosts(data.posts)
  
		  setChartData({
			 labels: ['Positive', 'Negative', 'Neutral'],
			 datasets: [
				{
				  label: 'Percentage of Posts',
				  backgroundColor: ['#28a745', '#dc3545', '#6c757d'],
				  data: [
					posObj.percentagePositive,
					negObj.percentageNegative,
					neuObj.percentageNeutral,
				  ],
				},
				{
				  label: 'Average Confidence Score (%)',
				  backgroundColor: ['#28a74580', '#dc354580', '#6c757d80'],
				  data: [
					 posObj.percentagePCS,
					 negObj.percentageNCS,
					 neuObj.percentageNeutralCS,
				  ],
				},
			 ],
		  });
		};  
		fetchSentimentData();
	 }, [chartData,setChartData]);

	useEffect(()=>{
		const filterPosts = ()=>{
			setFilteredPosts(posts?.filter((p:any)=>p.sentiment === selectedSentiment))
		}
		filterPosts()
	},[posts, selectedSentiment])
	console.log(`filteredPosts: `,filteredPosts)
	 const creatorName = (post:Post) =>{
		if (typeof post.creator ==="object" && post.creator?.uname){
			return post.creator?.uname
		} else {
			return 'unknown'
		}
	}
	const color = (sentiment:string) =>{
		if (sentiment === 'positive'){
			return 'green'
		} else if (sentiment === 'negative'){
			return 'red'
		} else {
			return 'gray'
		}
	}
	return (
		<div>
			<h2 className="text-center my-4">Posts Analysis Overview</h2>
			<div className="chart">
			{chartData && (
				<Bar
					data={chartData}
					options={{
						indexAxis: 'y',
						scales: {
						x: {
							min: 0,
							max: 100,
							ticks: {
								callback: (value: number | string) => `${Number(value)}%`,
							},
						},
						},
						plugins: {
						legend: {
							position: 'bottom',
						},
						},
					}}
				/>
			)}
      </div>
			<div className="radioBtn">
				<div className="mx-4">
					<input 
					type="radio" 
					name="posts" 
					value="positive"
					checked={selectedSentiment==='positive'}
					onChange={()=>setSelectedSentiment('positive')} /> <label><i className="bi bi-flag-fill mx-2" style={{ color:"green" }}></i></label>
					</div>
				<div className="mx-4">
					<input 
					type="radio" 
					name="posts" 
					value="negative"
					checked={selectedSentiment==='negative'}
					onChange={()=>setSelectedSentiment('negative')} /> 
					<label><i className="bi bi-flag-fill mx-2" style={{ color:"red" }}></i></label>
				</div>
				<div className="mx-4">
					<input 
					type="radio" 
					name="posts" 
					value="neutral"
					checked={selectedSentiment==='neutral'}
					onChange={()=>setSelectedSentiment("neutral")} />
					<label><i className="bi bi-flag-fill mx-2" style={{ color:"gray" }}></i></label>
				</div>				
			</div>
			<div className="table-posts">
				<table className="table table-striped">
					<thead>
						<tr>
							<th scope="col">ID</th>
							<th scope="col">Posted by</th>
							<th scope="col">[when]Title</th>
							<th scope="col">Descriptionb</th>
							<th scope="col">Analysis<i className="bi bi-flag-fill"></i></th>
							<th scope="col">Confidence Score</th>
						</tr>
					</thead>
					<tbody>
					{filteredPosts && filteredPosts.length > 0 ? (
						filteredPosts.map((post: any) => (
							<tr key={post.id}>
							<th scope="row">{post.id}</th>
							<td>{creatorName(post)}</td>
							<td>[{post.timestamp}] {post.title}</td>
							<td>{post.description.slice(0, 20).concat(" ...")}</td>
							<td>
								<i className="bi bi-flag-fill" style={{ color: color(post.sentiment) }}></i>
							</td>
							<td>{post.confidence_score}</td>
							</tr>
						))
						) : posts && posts.length > 0 ? (
						posts.map((post: any) => (
							<tr key={post.id}>
							<th scope="row">{post.id}</th>
							<td>{creatorName(post)}</td>
							<td>[{post.timestamp}] {post.title}</td>
							<td>{post.description.slice(0, 20).concat(" ...")}</td>
							<td>
								<i className="bi bi-flag-fill" style={{ color: color(post.sentiment) }}></i>
							</td>
							<td>{post.confidence_score}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={6} style={{ textAlign: "center" }}>
							No Posts Available
							</td>
						</tr>
					)}
						</tbody>

				</table>
			</div>
		</div>
	)
}
export default AdminPosts