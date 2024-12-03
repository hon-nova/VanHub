import express from "express";

const router = express.Router();

router.get('/public',(req,res)=>{
	console.log(`@posts current user: `,req.user)
	const posts =[{id:1,title:"Girl 27",link:"http://phpbb.com/dui/nec/nisi/volutpat/eleifend.json",description:"Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.\n\nAenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.\n\nCurabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.",creator:"",subgroup:"Networked",timestamp:"70-890-3228"},
	{id:3,title:"Penthouse North",link:"http://163.com/phasellus/id/sapien.jsp",description:"Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",creator:"",subgroup:"orchestration",timestamp:"59-087-8487"}] as any

	res.json({posts,successMsg:'Backend success - All Posts live here ... '})
})

export default router;