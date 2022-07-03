/*
	包含多个action creator函数
	同步action：{type, data}
	异步action：dispatch => {}
 */

import {reqLogin} from "../api";
import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MEG, RESET_USER} from "./action-types";
import storageUtils from "../utils/storageUtils";
import {message} from "antd";

// 设置标题的同步action
export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle});
// 登录成功action
export const receiveUser = (user) => ({type: RECEIVE_USER, data: user});
// 登录失败，返回错误信息
export const showErrorMsg = (msg) => ({type: SHOW_ERROR_MEG, data: msg});

// 用于登录的异步action
export const login = (username, password) => {
	return async dispatch => {
		// 1. 执行ajax请求
		const result = await reqLogin(username, password);
		if (result.status === 0) {
			// 2.1 登录成功，返回成功的action
			const user = result.data;
			// 保存到localStorage
			storageUtils.saveUser(user);
			// store中保存
			dispatch(receiveUser(user));
		} else {
			// 2.2 登录失败，返回失败的action
			const msg = result.msg;
			message.error('登录失败：' + msg);
			dispatch(showErrorMsg(msg));
		}
	}
}

// 用于退出登录的同步action
export const logout = () => {
	// 1. 删除localStorage中的数据
	storageUtils.removeUser();
	// 2. 返回登出的action
	return {type: RESET_USER}
}

