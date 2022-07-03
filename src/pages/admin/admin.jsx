import React, {Component} from 'react';
import {connect} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import { Layout } from 'antd';

import Header from "../../components/header/header";
import LeftNav from "../../components/left-nav/left-nav";
// 二级路由
import Home from "../home/home";
import Category from "../category/category";
import Role from "../role/role";
import User from "../user/user";
import Product from "../product/product";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
	render() {
		const user = this.props.user;
		// 未登录，跳转到登录界面
		if (!user || !user._id) {
			return <Redirect to='/login'/>;
		}
		return (
			<Layout style={{minHeight: '100%'}}>
				<Sider>
					<LeftNav/>
				</Sider>
				<Layout>
					<Header>Header</Header>
					<Content style={{backgroundColor: '#fff', margin: '20px'}}>
						<Switch>
							<Route path='/home' component={Home}/>
							<Route path='/category' component={Category}/>
							<Route path='/product' component={Product}/>
							<Route path='/role' component={Role}/>
							<Route path='/user' component={User}/>
							<Route path='/charts/bar' component={Bar}/>
							<Route path='/charts/line' component={Line}/>
							<Route path='/charts/pie' component={Pie}/>
							<Redirect to='/home'/>
						</Switch>
					</Content>
					<Footer style={{margin: '0 auto', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default connect(
	state => ({user: state.user}),
	{}
)(Admin);