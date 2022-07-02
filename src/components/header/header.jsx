import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import jsonp from 'jsonp'

import menuList from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../link-button/linkButton";

import './header.less'

/*
	左侧导航模块
 */
class Header extends Component {
	
	getTitle = () => {
		const path = this.props.location.pathname;
		
		let title = '首页';
		let check = (unit) => {
			// 找到目标路由
			if (path.indexOf(unit.key) === 0) {
				title = unit.title;
				return true;
			}
			let flag = false;
			if (unit.hasOwnProperty('children')) {
				for (let child of unit.children) {
					flag = check(child);
					if (flag) return true;
				}
			}
			return false;
		}
		let flag = false;
		for (let item of menuList) {
			flag = check(item);
			if (flag) break;
		}
		
		return title;
	}
	
	// 退出登录
	logout = () => {
		// 显示确认框
		Modal.confirm({
			title: 'Confirm',
			icon: <ExclamationCircleOutlined />,
			content: '确定退出吗',
			okText: '确认',
			cancelText: '取消',
			onOk: () => {
				// 删除localStorage中的user数据
				storageUtils.removeUser();
				// 删除内存中的user数据
				memoryUtils.user = {};
				// 跳转到Login路由
				this.props.history.replace('/login');
			}
		});
	}
	
	render() {
		return (
			<div className='header'>
				<div className='header-top'>
					<span>欢迎，admin</span>
					<LinkButton onClick={this.logout}>退出</LinkButton>
				</div>
				<div className='header-bottom'>
					<div className='header-bottom-left'>{this.getTitle()}</div>
					<div className='header-bottom-right'>
						<span>2020-5-18 10:10:10</span>
						<img src="https://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/>
						<span>晴</span>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Header);