/*
	将用户信息存储到localStorage的模块
 */

import store from 'store';

const USER_KEY = 'user_key';

const storageUtils = {
	// 保存User
	saveUser(user) {
		// localStorage.setItem(USER_KEY, JSON.stringify(user));
		store.set(USER_KEY, user);
	},
	// 读取User
	getUser() {
		// return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
		return store.get(USER_KEY) || {};
	},
	// 移除User
	removeUser() {
		// localStorage.removeItem(USER_KEY);
		store.remove(USER_KEY);
	}
}

export default storageUtils;
