const URL = 'http://127.0.0.1:7002'

export default URL

export const appURL = 'http://localhost:8080/#/'

// 获取轮播
export const getSwiper = () => {
	return uni.request({
		url: URL + '/getSwiper',
	});
}

// 获取列表
export const getMyList = () => {
	return uni.request({
		url: URL + '/getMyList',
	});
}
// 通过类别分类列表
export const getMyListFromType = (type,sort) => {
	return uni.request({
		url: URL + '/getMyListFromType/'+type+'/'+sort,
	});
}
// 通过排序分类列表
export const getMyListFromSort = (sort,type) => {
	return uni.request({
		url: URL + '/getMyListFromSort/'+sort+'/'+type,
	});
}

// 通过id获取item详情
export const getItemDetails = (id) => {
	return uni.request({
		url: URL + '/getItemDetails/'+id,
	});
}
// 获取类别列表
export const getItemType = () => {
	return uni.request({
		url: URL + '/getItemType',
	});
}

// 获取价格单位列表
export const getUnitList = () => {
	return uni.request({
		url: URL + '/getUnitList',
	});
}

// 图片地址url
export const upImgUrl = URL + '/upImgToTemporary'
//图片上传
export const upImgToTemporary = () => {
	return uni.request({
		url: URL + '/upImgToTemporary',
	});
}

// 添加item
export const addItemSubmit = (data) => {
	return uni.request({
		url: URL + '/addItemSubmit',
		method:'POST',
		data
	});
}
export const delItem = (id) => {
	return uni.request({
		url: URL + '/delItem/'+id,
		method:'DELETE'
	});
}
// // 测试session
// export const ceshi = () => {
// 	return uni.request({
// 		url: URL + '/ceshi'
// 	});
// }
// // 测试session2
// export const ceshi2 = () => {
// 	return uni.request({
// 		url: URL + '/ceshi2'
// 	});
// }

// 批量删除
export const delItems = (ids) => {
	ids = ids.join(',')
	return uni.request({
		url: URL + '/delItems/'+ids,
		method:'DELETE'
	});
}

// 获取分组类型列表
export const getGropType = () => {
	return uni.request({
		url: URL + '/getGropType',
	});
}
// 删除分组类型列表
export const delGropType = (id) => {
	return uni.request({
		url: URL + '/delGropType/'+id,
		method:'DELETE'
	});
}
// 添加分组类型列表
export const addGropType = (data) => {
	return uni.request({
		url: URL + '/addGropType',
		method:'POST',
		data
	});
}
// item加入分组类型列表
export const joinGrop = (id,gropName) => {
	return uni.request({
		url: URL + '/joinGrop/'+id+'/'+gropName
	});
}
// 批量加入分组
export const joinGrops = (ids,gropName) => {
	ids = ids.join(',')
	return uni.request({
		url: URL + '/joinGrops/'+ids+'/'+gropName
	});
}

// 获取分组item列表
export const getGropList = (sort,type) => {
	return uni.request({
		url: URL + '/getGropList/'+sort+'/'+type,
	});
}


// 收藏单个
export const collectItem = (data) => {
	return uni.request({
		url: URL + '/collectItem/',
		method:'POST',
		data
	});
}
// 取消收藏
export const delCollectItem = (ids,userId) => {
	ids = ids.join(',')
	return uni.request({
		url: URL + '/delCollectItem/'+ids+'/'+userId,
		method:'DELETE'
	});
}
// 获取收藏列表
export const getCollectList = (userId) => {
	return uni.request({
		url: URL + '/getCollectList/'+userId,
	});
}


// 加入历史
export const joinHistory = (data) => {
	return uni.request({
		url: URL + '/joinHistory/',
		method:'POST',
		data
	});
}

// 获取收藏列表
export const getHistoryList = (userId) => {
	return uni.request({
		url: URL + '/getHistoryList/'+userId,
	});
}
