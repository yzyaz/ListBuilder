'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path')
const tinify = require('tinify');
tinify.key = '5b3NrHFyQ24gykF1F6DZzW5gmWgHjZNQ';

class HomeController extends Controller {
	async index() {
		const {
			ctx
		} = this;
		ctx.body = 'hi, egg';
	}

	// 	async ceshi() {
	// 		this.ctx.session.sessionId='1234560'
	// 		console.log('222',this.ctx.session.sessionId)
	// 		this.ctx.body = 'session';
	// 	}
	// async ceshi2() {
	// 	console.log('session',this.ctx.session.sessionId)
	// 	this.ctx.body = 'get session';
	// }

	async getSwiper() {
		const res = await this.app.mysql.select('swiper_img');
		this.ctx.body = res;
	}

	// 获取列表
	async getMyList() {

		const sql =
			`select id, itemType, itemCreateDate, itemShowImg, itemTitle, itemTags, itemSite, itemPrice from mylist order by itemCreateDate desc `
		const res = await this.app.mysql.query(sql);
		this.ctx.body = res;
	}
	// 类别筛选列表
	async getMyListFromType() {
		const sort = this.ctx.params.sort.split('-')
		const type = this.ctx.params.type
		console.log('type--', type)
		let itemKey, sortType
		console.log('sort--', sort)
		switch (sort[0]) {
			case 'time':
				itemKey = 'itemCreateDate'
				break;
			case 'price':
				itemKey = 'itemPrice'
				break;
			default:
				itemKey = ''
				break;
		}
		let sql
		if (type === '全部') {
			sql =
				`select id, itemType, itemCreateDate, itemShowImg, itemTitle, itemTags, itemSite, itemPrice from mylist order by ${itemKey} ${sort[1]} `
		} else {
			sql =
				`select id, itemType, itemCreateDate, itemShowImg, itemTitle, itemTags, itemSite, itemPrice from mylist where itemType = '${type}' order by ${itemKey} ${sort[1]} `
		}

		const res = await this.app.mysql.query(sql);
		this.ctx.body = res;
	}
	// 排序列表
	async getMyListFromSort() {
		const sort = this.ctx.params.sort.split('-')
		const type = this.ctx.params.type
		console.log('sort--', sort)
		let itemKey, sortType
		switch (sort[0]) {
			case 'time':
				itemKey = 'itemCreateDate'
				break;
			case 'price':
				itemKey = 'itemPrice'
				break;
			default:
				itemKey = ''
				break;
		}
		let sql
		if (type === '全部') {
			sql =
				`select id, itemType, itemCreateDate, itemShowImg, itemTitle, itemTags, itemSite, itemPrice from mylist order by ${itemKey} ${sort[1]} `
		} else {
			sql =
				`select id, itemType, itemCreateDate, itemShowImg, itemTitle, itemTags, itemSite, itemPrice from mylist where itemType = '${type}' order by ${itemKey} ${sort[1]} `

		}
		console.log('sql', sql)
		const res = await this.app.mysql.query(sql);
		this.ctx.body = res;
	}

	async getItemDetails() {
		const id = this.ctx.params.id
		const sql = `select * from mylist where id = '${id}'`
		const res = await this.app.mysql.query(sql);
		this.ctx.body = res;
	}

	async getItemType() {
		const res = await this.app.mysql.select('itemtype');
		this.ctx.body = res;
	}

	async getUnitList() {
		const res = await this.app.mysql.select('unitlist');
		this.ctx.body = res;
	}

	// 添加数据
	async addItemSubmit() {
		//   获得前端传过来的数据
		const itemData = this.ctx.request.body;

		// 处理内容图片
		if (itemData.itemImgList) {
			itemData.itemImgList.split(',').forEach(async i => {
				// console.log('imgName', i)
				const imgName = i.split('/').pop();
				let imgUrls = imgName.split('.')
				imgUrls[imgUrls.length - 2] += 'ys'
				let ysName = imgUrls.join('.')
				// console.log('ysname', ysName)

				// const imgName = i.split('/').pop();
				// let ysName = imgName.split('.');
				// ysName[0] = ysName[0] + 'ys.';
				// ysName = ysName.join('');

				const storageImg = new Promise((ok, no) => {
					const rs = fs.createReadStream('app/public/temporary/' + imgName);
					const ws = fs.createWriteStream('app/public/itemImgs/' + imgName);
					rs.pipe(ws);

					// 拷贝一个源文件为ys名,避免压缩失败没有ys图
					const wsys = fs.createWriteStream('app/public/itemImgs/' + ysName);
					rs.pipe(wsys);

					ws.on('finish', () => {
						ok('完成');
					});
					ws.on('error', err => {
						no(err);
					});
				});

				let msg;
				try {
					msg = await storageImg;
				} catch (error) {
					msg = '存储失败:' + error;
				}
				// yzyconsole.log('存入信息:', msg);

				// 压缩图片
				// images('app/public/admin/temporary/' + imgName).save('app/public/admin/articleBgi/' + ysName, { quality: 20 });// 压缩比50

				try {
					tinify.fromFile('app/public/temporary/' + imgName).toFile('app/public/itemImgs/' + ysName);
				} catch (error) {
					// yzyconsole.log(error);
				}

				// 删除临时文件 删除所有的文件(将所有文件夹置空)
				// const emptyDir = function(fileUrl) {
				//   const files = fs.readdirSync(fileUrl);// 读取该文件夹
				//   files.forEach(function(file) {
				//     const stats = fs.statSync(fileUrl + '/' + file);
				//     if (stats.isDirectory()) {
				//       emptyDir(fileUrl + '/' + file);
				//     } else {
				//       fs.unlinkSync(fileUrl + '/' + file);
				//       console.log('删除文件' + fileUrl + '/' + file + '成功');
				//     }
				//   });
				// };
				// emptyDir('app/public/admin/temporary');

			});

		}


		// 向数据库插入数据
		const result = await this.app.mysql.insert('mylist', itemData);
		// 判断是否成功,插入成功返回的row数
		const insertSuccess = result.affectedRows === 1;
		// 保存返回修改的id
		const insertId = result.insertId;
		// 返回给前端保存信息
		this.ctx.body = {
			isScuccess: insertSuccess,
			insertId,
		};
	}

	async delItem() {
		const id = this.ctx.params.id
		// const sql = `delete from mylist where id = ${id}`
		// const res = await this.app.mysql.query(sql)
		const res = await this.app.mysql.delete('mylist', {
			id
		})
		this.ctx.body = res
	}

	async delItems() {
		const ids = this.ctx.params.ids
		const sql = `delete from mylist where id in (${ids})`
		const res = await this.app.mysql.query(sql)
		// const res =  await this.app.mysql.delete('mylist', { id })
		this.ctx.body = res
	}

	async getGropType() {
		const sql = `select * from groptype order by createDate desc`
		const res = await this.app.mysql.query(sql);
		this.ctx.body = res
	}

	async delGropType() {
		const id = this.ctx.params.id
		// const sql = `delete from mylist where id = ${id}`
		// const res = await this.app.mysql.query(sql)
		const res = await this.app.mysql.delete('groptype', {
			id
		})
		this.ctx.body = res
	}

	async addGropType() {
		const itemData = this.ctx.request.body;
		// 向数据库插入数据
		const result = await this.app.mysql.insert('groptype', itemData);
		// 判断是否成功,插入成功返回的row数
		const insertSuccess = result.affectedRows === 1;
		// 保存返回修改的id
		const insertId = result.insertId;
		// 返回给前端保存信息
		this.ctx.body = {
			isScuccess: insertSuccess,
			insertId,
		};
	}

	async joinGrop() {
		const id = this.ctx.params.id
		const gropName = this.ctx.params.gropName
		const sql = `update mylist set gropType = '${gropName}' where id = ${id} `
		const res = await this.app.mysql.query(sql);
		this.ctx.body = res

	}
	//获取分组item列表
	async getGropList() {
		const sort = this.ctx.params.sort.split('-')
		const type = this.ctx.params.type
		console.log('sort--', sort)
		let itemKey, sortType
		switch (sort[0]) {
			case 'time':
				itemKey = 'itemCreateDate'
				break;
			case 'price':
				itemKey = 'itemPrice'
				break;
			default:
				itemKey = ''
				break;
		}
		let sql
		if (!type) {
			sql =
				`select id, itemType, itemCreateDate, itemShowImg, itemTitle, itemTags, itemSite, itemPrice from mylist order by ${itemKey} ${sort[1]} `
		} else {
			sql =
				`select id, itemType, itemCreateDate, itemShowImg, itemTitle, itemTags, itemSite, itemPrice from mylist where gropType = '${type}' order by ${itemKey} ${sort[1]} `

		}
		console.log('sql', sql)
		const res = await this.app.mysql.query(sql);
		this.ctx.body = res;
	}


	// 将上传图片存到暂存文件夹temporary(要不然上传了图片又没点保存图片就一直在静态文件夹中,做完这个后再去文章保存接口把暂存文件夹中的放到静态文件中)
	async upImgToTemporary() {
		//   获得前端传过来的文件
		const parts = this.ctx.request.files;
		const res = [];

		// 去掉特殊字符函数
		const excludeSpecial = function(s) {
			// 去掉转义字符
			s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
			// 去掉特殊字符
			s = s.replace(/[\-\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/g, '');
			return s;
		};

		parts.forEach(async item => {

			// 保存的图片名称
			// const wsName = new Date().getTime() + path.extname(item.filename);
			const wsName = '(' + new Date().getTime() + ')' + excludeSpecial(item.filename);
			// 压缩图片的名称
			// const ysName = new Date().getTime() + 'ys' + path.extname(item.filename);
			// 流式写入temporary临时文件
			await new Promise((ok, no) => {
				const rs = fs.createReadStream(item.filepath);
				const ws = fs.createWriteStream('app/public/temporary/' + wsName);
				rs.pipe(ws);
				ws.on('finish', () => { // 暴露也没有用,这样好免得出错
					ok('完成');
				});
				ws.on('error', err => {
					no(err);
				});

				// 压缩图片
				// images(item.filepath).save('app/public/admin/articleBgi/' + ysName, { quality: 50 });// 压缩比50

				// // 删除服务器路径临时文件
				// fs.unlink(parts[0].filepath, err => {
				//   if (err) throw err;
				// });

				res.push({
					url: '/public/temporary/' + wsName,
					wsName,
				});
			});

		});
		// 返回给前端名字,前端可拿这个地址访问图片静态资源
		this.ctx.body = res;
		// 关闭数据连接??
		this.ctx.cleanupRequestFiles();
	}
}

module.exports = HomeController;
