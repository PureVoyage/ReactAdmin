import React, {Component, createRef} from 'react';
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Checkbox } from 'antd';

import {login} from "../../redux/actions";

import logo from '../../assets/images/logo.png'
import './login.less'

class Login extends Component {
	
	form = createRef();
	
	/*
		发送AJAX请求
	 */
	// antd默认取消了跳转行为
	handleLogin = async (values) => {
		const { username, password } = values;
		// 调用redux的异步action creator，并更新状态
		this.props.login(username, password);
		// const result = await reqLogin(username, password); // 获取响应体数据
		// const user = result.data;
		// if (result.status === 0) { // 登录成功
		// 	message.success('登录成功');
		// 	// 跳转到主页
		// 	// this.props.history.replace('/');
		// 	window.location.reload(); // 防止路由导航失效，强制页面刷新
		// 	// 保存账号信息
		// 	// memoryUtils.user = user;
		// 	storageUtils.saveUser(user);
		// } else { // 失败
		// 	message.error('登录失败：' + result.msg);
		// }
	}
	
	render() {
		// 如果用户里面已经登录，跳转到主页（从redux中取）
		const user = this.props.user;
		if (user && user._id) {
			return <Redirect to='/'/>;
		}
		return (
			<div className='login'>
				<header className='login-header'>
					<img src={logo} alt=""/>
					<h1>React: 后台管理系统</h1>
				</header>
				<section className='login-content'>
					<h2>用户登录</h2>
					{/*
						用户名/密码合法性要求
						1. 必须输入
						2. 必须大于4位
						3. 必须小于12位
						4. 必须是英文，数字或下划线的组成
					*/}
					<Form
						name="normal_login"
						className="login-form"
						initialValues={{
							remember: true,
						}}
						onFinish={this.handleLogin}
						ref={this.form}
					>
						<Form.Item
							name="username"
							// 声明式验证：直接食用别人定义好的规则进行验证
							rules={[
								{ required: true, message: '请输入您的用户名!' },
								{ min: 4, message: '用户名长度至少为4位!' },
								{ max: 12, message: '用户名长度至多为12位!' },
								{ pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字和下划线的组合!' }, // 正则匹配
							]}
						>
							<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
						</Form.Item>
						<Form.Item
							name="password"
							// 自定义验证
							rules={[
								{ required: true, message: '请输入您的密码!' },
								{ min: 4, message: '密码长度至少为4位!' },
								{ max: 12, message: '密码长度至多为12位!' },
								{ pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须是英文，数字和下划线的组合!' }, // 正则匹配
							]}
						>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="密码"
							/>
						</Form.Item>
						<Form.Item>
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>记住我</Checkbox>
							</Form.Item>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" className="login-form-button">
								登录
							</Button>
						</Form.Item>
					</Form>
				</section>
			</div>
		);
	}
}

export default connect(
	state => ({user: state.user}),
	{login}
)(Login);