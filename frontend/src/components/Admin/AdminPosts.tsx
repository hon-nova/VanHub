import '../../styles/css/admin-posts-style.css'

const AdminPosts: React.FC = ()=>{

	return (
		<div>
			<h2>Admin Posts</h2>
			<div className="chart">chart</div>
			<div className="radioBtn">
				<div className="mx-4">
					<input type="radio" name="posts" value="positive" /> <label><i className="bi bi-flag-fill" style={{ color:"green" }}></i></label>
					</div>
				<div className="mx-4">
					<input type="radio" name="posts" value="negative" /> 
					<label><i className="bi bi-flag-fill" style={{ color:"red" }}></i></label>
				</div>
				<div className="mx-4">
					<input type="radio" name="posts" value="neutral" />
					<label><i className="bi bi-flag-fill" style={{ color:"gray" }}></i></label>
				</div>				
			</div>
			<div className="table-posts">
				<table className="table table-striped">
					<thead>
						<tr>
							<th scope="col">Post ID</th>
							<th scope="col">Posted by</th>
							<th scope="col">[when]Post Title</th>
							<th scope="col">Post Descriptionb[10-word]</th>
							<th scope="col">Sentiment <i className="bi bi-flag-fill"></i></th>
							<th scope="col">Confidence Score</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">1</th>
							<td>Posted by</td>
							<td>[timestamp]Title</td>
							<td>Description</td>
							<td>Sentiment <i className="bi bi-flag-fill"></i></td>
							<td>Confidence Score</td>
						</tr>						
					</tbody>
				</table>
			</div>
		</div>
	)
}
export default AdminPosts