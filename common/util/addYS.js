export default function(imgUrl){
	let imgUrls = imgUrl.split('.')
	imgUrls[imgUrls.length-2]+='ys'
	// console.log("imgUrls.join('.')",imgUrls.join('.'))
	return imgUrls.join('.')
}