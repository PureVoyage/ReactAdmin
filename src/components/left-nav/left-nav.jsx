import React from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from "react-router-dom";
import {
	HomeOutlined,
	AppstoreOutlined,
	BarsOutlined,
	ToolOutlined,
	UserOutlined,
	SafetyOutlined,
	AreaChartOutlined,
	BarChartOutlined,
	LineChartOutlined,
	PieChartOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import {connect} from "react-redux";

import menuList from "../../config/menuConfig";
import {setHeadTitle} from "../../redux/actions";

import './left-nav.less'
import logo from '../../assets/images/logo.png'


function getItem(label, key, icon, children, type) {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
}

const items = [
	getItem(<Link to='/home'><span>首页</span></Link>, '/home', <HomeOutlined />),
	getItem(<span>商品</span>, 'sub1', <AppstoreOutlined />, [
		getItem(<Link to='/category'><span>品类管理</span></Link>, '/category', <BarsOutlined />),
		getItem(<Link to='/product'><span>商品管理</span></Link>, '/product', <ToolOutlined />),
	]),
	getItem(<Link to='/user'><span>用户管理</span></Link>, '/user', <UserOutlined />),
	getItem(<Link to='/role'><span>角色管理</span></Link>, '/role', <SafetyOutlined />),
	// getItem(<span>图形图表</span>, 'sub2', <AreaChartOutlined />, [
	// 	getItem(<Link to='/charts/bar'><span>柱状图</span></Link>, '/charts/bar', <BarChartOutlined />),
	// 	getItem(<Link to='/charts/line'><span>折线图</span></Link>, '/charts/line', <LineChartOutlined />),
	// 	getItem(<Link to='/charts/pie'><span>饼状图</span></Link>, '/charts/pie', <PieChartOutlined />),
	// ]),
];


/*
	左侧导航模块
 */

class LeftNav extends React.Component {
	
	constructor() {
		super();
		this.state = {
			openKeys: ['']
		}
		this.openKeys = [];
	}
	
	changeMenu = (item) => {
		// 检查当前子路由是否在别人的children属性中
		const openKeys = [];
		function check(item, target) {
			// 检查当前key是否等于target
			if (item.key === target) {
				return true;
			}
			// 如果有子路由，继续查找
			let flag = false;
			if (item.hasOwnProperty('children')) {
				for (let child of item.children) {
					flag = check(child, target);
					if (flag) {
						openKeys.push(item.key);
						break;
					}
				}
			}
			return flag;
		}
		menuList.forEach((value, index) => {
			check(value, this.props.location.pathname)
		})
		this.openKeys = openKeys;
	}
	
	render() {
		const path = this.props.location.pathname;
		this.changeMenu();
		return (
			<div className='left-nav'>
				<Link to='/home' className='left-nav-header'>
					<img src={logo} alt=''/>
					<h1>后台管理</h1>
				</Link>
				<Menu
					selectedKeys={[path]} // 当前路由为列表中的值，该菜单项处于自动选中状态
					defaultOpenKeys={this.openKeys} // 第一次渲染时展开列表中的子菜单项, openKeys后续可被修改
					mode="inline"
					theme="dark"
					// inlineCollapsed={collapsed}
					items={items}
					onClick={this.changeMenu}
				/>
			</div>
		)
	}
}

LeftNav.propTypes = {
	setHeadTitle: PropTypes.func
}

export default connect(
	state => ({}),
	{setHeadTitle}
)(withRouter(LeftNav));