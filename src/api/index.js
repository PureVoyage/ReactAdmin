/*
	对ajax请求二次封装，固定url和method，让用户只需要输入params
	返回值都是Promise对象
 */

import ajax from "./ajax";
import jsonp from "jsonp";
import storageUtils from "../utils/storageUtils";
import memoryUtils from "../utils/memoryUtils";

// 读取localStorage保存的用户信息，保存到内存中，而不是每次都从localStorage中读取
let user = storageUtils.getUser();
memoryUtils.user = user;

// 登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');
// 添加用户
// export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST');

// 获取一级/二级分类列表
export const reqCategories = (parentId) => ajax('/manage/category/list', {parentId}, 'GET');
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName, parentId}, 'POST');
// 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST');
// 通过ID获取分类名
export const reqCategoryName = (categoryId) => ajax('/manage/category/info', {categoryId}, 'GET')


// 获取商品列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize}, 'GET');
// 搜索商品分页列表
export const reqSearchProduct = (searchType, pageNum, pageSize, searchKey) => {
	const params = {
		pageNum: pageNum,
		pageSize: pageSize
	}
	if (searchType === 'name') {
		// 按名称搜索
		params['productName'] = searchKey;
		return ajax('/manage/product/search', params, 'GET')
	} else {
		// 按描述搜索
		params['productDesc'] = searchKey;
		return ajax('/manage/product/search', params, 'GET')
	}
}
// 更新商品状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST');
// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product.hasOwnProperty('_id') ? 'update' : 'add'), product, 'POST')

// 获取所有用户数据
export const reqUsers = () => ajax('/manage/user/list', {}, 'GET');
// 添加新用户
export const reqAddUser = (username, password, phone, email='', role_id='') => ajax('/manage/user/add', {username, password, phone, email, role_id}, 'POST');
// 更新用户信息
export const reqUpdateUser = (_id, username, phone, email='', role_id='') => ajax('/manage/user/update', {_id, username, phone, email, role_id}, 'POST');
// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST');

// 获取所有角色数据
export const reqRoles = () => ajax('/manage/role/list', {}, 'GET');
// 添加角色
export const reqAddRoles = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')
// 更改角色权限
export const reqUpdateAuth = (_id, menus, auth_time, auth_name) => ajax('/manage/role/update', {_id, menus, auth_time, auth_name}, 'POST')


/*
	jsonp获取天气信息
 */
export const reqWeather = (city) => {
	const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
	jsonp(url, {}, (err, data) => {
		console.log(err, data);
	})
}

// reqWeather('北京');


/*
	获取一级分类列表
 */

