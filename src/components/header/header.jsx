import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {connect} from "react-redux";
// import jsonp from 'jsonp'

import menuList from "../../config/menuConfig";
import LinkButton from "../link-button/linkButton";
import {logout} from "../../redux/actions";

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
				this.props.logout();
			}
		});
	}
	
	render() {
		const title = this.getTitle();
		const username = this.props.user.username;
		return (
			<div className='header'>
				<div className='header-top'>
					<span>欢迎，{username}</span>
					<LinkButton onClick={this.logout}>退出</LinkButton>
				</div>
				<div className='header-bottom'>
					<div className='header-bottom-left'>{title}</div>
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

// ES6之后propTypes需要写在外面，因为不建议写类变量
Header.propTypes = {
	headTitle: PropTypes.string,
	user: PropTypes.object
}

export default connect(
	state => ({headTitle: state.headTitle, user: state.user}),
	{logout}
)(withRouter(Header));