/*
	发送异步ajax请求的模块，基于axios库
 */

import axios from "axios";
import { message } from 'antd';

export default function ajax(url, params={}, method='GET') {
	return new Promise((resolve, reject) => {
		let promise;
		if (method === 'GET') {
			promise = axios.get(url, {
				params: params
			});
		} else {
			promise = axios.post(url, params);
		}
		
		promise.then(response => {
			resolve(response.data);
		}).catch(error => {
			message.error('登录失败：' + error.message);
		})
	})
}
