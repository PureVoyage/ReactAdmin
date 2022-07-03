/*
	prevState + action ==> newState
 */

import {combineReducers} from "redux";

import storageUtils from "../utils/storageUtils";
import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MEG, RESET_USER} from "./action-types";

// 管理头部标题状态更新的reducer
const initHeadTitle = '首页';
function headTitle(state=initHeadTitle, action) {
	switch (action.type) {
		case SET_HEAD_TITLE:
			return action.data;
		default:
			return state;
	}
}

// 管理当前登录用户的状态更新的reduce
const initUser = storageUtils.getUser();
function user(state=initUser, action) {
	switch (action.type) {
		case RECEIVE_USER:
			return action.data;
		case SHOW_ERROR_MEG:
			const msg = action.data;
			return {...state, msg}; // 注意不要直接修改原state，而是在原来的基础上返回一个新的state
		case RESET_USER:
			return {};
		default:
			return state;
	}
}

/*
	向外暴露的是合并产生的总的reducer
 */
export default combineReducers({
	headTitle,
	user
});
