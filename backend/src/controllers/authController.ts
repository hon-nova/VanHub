import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPEN_ACCESS_KEY });
import { getPosts, getPostById }  from '../controllers/postController'
import { Post }  from '../shared/interfaces/index'

console.log(`process.env.OPEN_ACCESS_KEY: `,process.env.OPEN_ACCESS_KEY)
const getSentiment = async (description : string) => {
	try {
	  const completion = await openai.chat.completions.create({
		 model: 'gpt-3.5-turbo', 
		 messages: [
			{
			  role: 'system',
			  content: 'You are a helpful assistant for sentiment analysis.',
			},
			{
			  role: 'user',
			  content: `Please analyze the sentiment of the following text and classify it as positive, negative, or neutral. Provide only the sentiment as a single word response, followed by a confidence score as a percentage:\n\n${description}`,
			},
		 ],
	  });
	//   console.log(`IMPORTANT FIRST`)
	//   console.log(`completion.choices[0]:`,completion.choices[0])
	  const sentiment = completion.choices[0].message?.content?.toLowerCase();
	//   console.log('Sentiment:', sentiment);
	  return sentiment;
	} catch (error) {
	  console.error('Error analyzing sentiment:', error);
	  return 'error';
	}
 };
 async function analyzeSentiment():Promise<any[]>{
	const sentimentArr:any =[]
	const posts = await getPosts()
	await Promise.all(posts.map(async (post:Post)=>{
		const sentiment = await getSentiment(post.description)
		const sen = sentiment?.split(",")[0]
		const cs = (sentiment?.split(",")[1]) ? parseFloat(sentiment?.split(",")[1]) : 0
		sentimentArr.push({post_id:post.id,sentiment:sen,confidence_score:cs})
	}))
	// console.log(`what is sentiments here: `,sentiments)
	console.log(`sentimentArr: `,sentimentArr)
	return sentimentArr
 }
 async function positivePosts(): Promise<Post[]|null>{
	const sentimentArr = await analyzeSentiment()
	
	const positiveSentiments = sentimentArr.filter((obj:any)=>obj.sentiment === 'positive')
	const percentagePositive =(positiveSentiments.length/sentimentArr.length)*100
	const percentagePCS = positiveSentiments.reduce((acc:any,obj:any)=>acc+obj.confidence_score,0)/positiveSentiments.length
	// console.log(`percentageCS: `,percentageCS)
	// console.log(`percentagePositive: `,percentagePositive)
	// console.log(`positiveSentiments: `,positiveSentiments)
	const positivePosts = await Promise.all(
		positiveSentiments
			.map(async(obj:any)=>await getPostById(obj.post_id)))
	// console.log(`positivePosts: `,positivePosts)

	return positivePosts as Post[]
 }
 async function negativePosts(): Promise<Post[]>{
	const sentimentArr = await analyzeSentiment()
	const negativeSentiments = sentimentArr.filter((obj:any)=>obj.sentiment === 'negative')
	const negativePosts = (await Promise.all(
		negativeSentiments			
			.map(async(obj:any)=> await getPostById(obj.post_id))))
	
	const percentageNegative = (negativePosts.length/sentimentArr.length)*100
	const percentageNCS = negativeSentiments.reduce((acc:number,obj:any)=>acc+obj.confidence_score,0)/negativeSentiments.length

	console.log(`percentageNCS: `,percentageNCS)
	console.log(`percentageNegative: `,percentageNegative)
	// console.log(`negativePosts: `,negativePosts)
	return negativePosts as Post[]
 }

 (async ()=>{
	// console.log(`authController: process.env.OPEN_ACCESS_KEY: `,process.env.OPEN_ACCESS_KEY)
	// getSentiment('I love this product').then((data)=>{console.log(`RESULT SENTIMENT ANALYSIS: `,data)})
	// analyzeSentiment().then((sentimentObj)=>console.log(JSON.stringify(sentimentObj,null,2)))
	// positivePosts().then((positivePosts)=>console.log(JSON.stringify(positivePosts,null,2)))
 })()

 export { getSentiment, analyzeSentiment,positivePosts,negativePosts }