const URL = 'http://127.0.0.1:7002'

export default URL

export const getSwiper = () => {
	return uni.request({
		url: URL + '/getSwiper',
	});
}

export const getMyList = () => {
	return uni.request({
		url: URL + '/getMyList',
	});
}
export const getMyListFromType = (type,sort) => {
	return uni.request({
		url: URL + '/getMyListFromType/'+type+'/'+sort,
	});
}
export const getMyListFromSort = (sort,type) => {
	return uni.request({
		url: URL + '/getMyListFromSort/'+sort+'/'+type,
	});
}

export const getItemType = () => {
	return uni.request({
		url: URL + '/getItemType',
	});
}

export const getUnitList = () => {
	return uni.request({
		url: URL + '/getUnitList',
	});
}

//图片上传
export const upImgUrl = URL + '/upImgToTemporary'
export const upImgToTemporary = () => {
	return uni.request({
		url: URL + '/upImgToTemporary',
	});
}

export const addItemSubmit = (data) => {
	return uni.request({
		url: URL + '/addItemSubmit',
		method:'POST',
		data
	});
}

