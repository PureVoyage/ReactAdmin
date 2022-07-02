import React, {Component} from 'react';
import {
	Card,
	Table,
	Button,
	message,
	Form,
	Input,
	Modal,
	Select
} from 'antd';

import {PAGE_SIZE} from "../../utils/constant";
import LinkButton from "../../components/link-button/linkButton";
import {reqUsers, reqAddUser, reqUpdateUser, reqDeleteUser} from "../../api";
import {ExclamationCircleOutlined} from "@ant-design/icons";

const Item = Form.Item;
const Option = Select.Option;

class User extends Component {
	
	constructor() {
		super();
		this.columns = [
			{
				title: '用户名',
				dataIndex: 'username',
			},
			{
				title: '邮箱',
				dataIndex: 'email',
			},
			{
				title: '电话',
				dataIndex: 'phone',
			},
			{
				title: '注册时间',
				dataIndex: 'create_time',
				render: time => {
					const date = new Date();
					date.setTime(time);
					return time === undefined ? time : date.toLocaleString();
				}
			},
			{
				title: '所属角色',
				dataIndex: 'role_id',
				render: id => {
					const role = this.state.roles.find((r) => {
						return id === r._id;
					});
					return role === undefined ? '' : role.name;
				}
			},
			{
				width: 150,
				title: '操作',
				render: (user) => {
					return (
						<span>
							<LinkButton
								onClick={async () => {
									this.setState({
										currentUser: user,
										updateModalVisible: true
									});
									const {username, phone, email} = user;
									const role = user.role_id;
									/*
										为什么这里要使用定时任务：
										1. 上面的setState是异步任务，而setFieldsValue是一个同步任务，所以setFieldsValue先于setState执行
										2. 这意味着第一次打开点击会导致Form未渲染完成时，setFieldsValue就会尝试读取form表单的name，这样一定会报错
										3. 定时器在JS中属于宏任务，其执行顺序在setState和微任务之后，这样嵌套一下就可以保证setFieldsValue在表单渲染完成后才执行
									 */
									setTimeout(() => {
										this.updateFormRef.current.setFieldsValue({
											'username': username,
											'phone': phone,
											'email': email,
											'role': role
										});
									})
								}}
							>
								修改
							</LinkButton>
							&nbsp;&nbsp;&nbsp;
							<LinkButton onClick={() => {this.deleteUser(user._id)}}>删除</LinkButton>
						</span>
					)
				}
			},
		];
		this.state = {
			users: [],
			roles: [],
			currentUser: {},
			addModalVisible: false,
			updateModalVisible: false,
		}
		this.addFormRef = React.createRef();
		this.updateFormRef = React.createRef();
	}
	
	// 获取全部用户数据
	getUsers = async () => {
		const result = await reqUsers();
		if (result.status === 0) {
			const {users, roles} = result.data;
			this.setState({
				users,
				roles
			});
		}
	}
	
	// 添加新的用户
	addUser = async () => {
		// console.log(this.addFormRef.current.getFieldsValue());
		// 1. 获取表单数据
		const {username, password, phone} = this.addFormRef.current.getFieldsValue();
		let {email, role} = this.addFormRef.current.getFieldsValue();
		// 2. 检查非必选项的值是否为空
		email = email === undefined ? '': email;
		role = role === undefined ? '': role;
		// 3. 发送ajax请求，添加用户
		const result = await reqAddUser(username, password, phone, email, role);
		if (result.status === 0) {
			message.success('添加用户成功');
			this.getUsers();
			this.setState({
				addModalVisible: false
			})
		} else {
			message.error('添加用户失败');
		}
	}
	
	// 更新某个用户
	updateUser = async () => {
		Modal.confirm({
			title: 'Confirm',
			icon: <ExclamationCircleOutlined />,
			content: '确定更新该用户信息吗',
			okText: '确认',
			cancelText: '取消',
			onOk: async () => {
				// 1. 获取表单数据
				const _id = this.state.currentUser._id;
				const {username, phone} = this.updateFormRef.current.getFieldsValue();
				let {email, role} = this.updateFormRef.current.getFieldsValue();
				// 2. 检查非必选项的值是否为空
				email = email === undefined ? '': email;
				role = role === undefined ? '': role;
				// 3. 发送ajax请求，添加用户
				const result = await reqUpdateUser(_id, username, phone, email, role);
				if (result.status === 0) {
					message.success('更新用户信息成功');
					this.getUsers();
					this.setState({
						updateModalVisible: false
					})
				} else {
					message.error('更新用户信息失败');
				}
			}
		});
	}
	
	// 删除某个用户
	deleteUser = (id) => {
		Modal.confirm({
			title: 'Confirm',
			icon: <ExclamationCircleOutlined />,
			content: '确定删除该用户吗',
			okText: '确认',
			cancelText: '取消',
			onOk: async () => {
				// 删除
				const result = await reqDeleteUser(id);
				if (result.status === 0) {
					message.success('删除用户成功');
					this.getUsers();
				} else {
					message.error('删除用户失败');
				}
			}
		});
	}
	
	componentDidMount() {
		this.getUsers();
	}
	
	render() {
		const {users, roles, currentUser, addModalVisible, updateModalVisible} = this.state;
		// 指定Item布局的配置对象
		const formItemLayout = {
			labelCol: { // 指定左侧label的宽度
				xs: { span: 12 },
				sm: { span: 4 },
			},
			wrapperCol: { // 指定右侧输入框的宽度
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		const title = (
			<span>
				<Button type='primary' onClick={() => {this.setState({addModalVisible: true})}}>创建用户</Button>
			</span>
		);
		return (
			<div>
				<Card title={title}>
					<Table
						bordered
						rowKey='_id'
						columns={this.columns}
						dataSource={users}
						pagination={{
							// loading: loading,
							// total: total,
							defaultPageSize: PAGE_SIZE,
							showQuickJumper: true,
							onChange: this.getProducts
						}} // 分页器，页面总数（后端分页），设置每页显示项数，跳转到某夜组件
						onChange={this.handleTableChange}
					/>
				</Card>
				<Modal title="添加用户" visible={addModalVisible} onOk={this.addUser} onCancel={() => {this.setState({addModalVisible: false})}}>
					<Form {...formItemLayout} ref={this.addFormRef} >
						<Item
							name='username'
							label='用户名：'
							rules={[
								{ required: true, message: '用户名不能为空!' },
							]}
						>
							<Input placeholder='请输入用户名'></Input>
						</Item>
						<Item
							name='password'
							label='密码：'
							rules={[
								{ required: true, message: '密码不能为空!' },
							]}
						>
							<Input placeholder='请输入密码'></Input>
						</Item>
						<Item
							name='phone'
							label='手机号：'
							rules={[
								{ required: true, message: '手机号不能为空!' },
								{ len: 11, message: '手机号长度必须为11位！' }
							]}
						>
							<Input placeholder='请输入手机号'></Input>
						</Item>
						<Item
							name='email'
							label='邮箱：'
						>
							<Input placeholder='请输入邮箱'></Input>
						</Item>
						<Item
							name='role'
							label='角色：'
						>
							<Select placeholder='请选择角色' style={{width: 200}}>
								{
									roles.map((r) => {
										return <Option key={r._id} value={r._id}>{r.name}</Option>
									})
								}
							</Select>
						</Item>
					</Form>
				</Modal>
				<Modal title="修改用户" visible={updateModalVisible} onOk={this.updateUser} onCancel={() => {this.setState({updateModalVisible: false})}}>
					<Form
						{...formItemLayout}
						ref={this.updateFormRef}
					>
						<Item
							name='username'
							label='用户名：'
							initialValue={currentUser.username}
							rules={[
								{ required: true, message: '用户名不能为空!' },
							]}
						>
							<Input key={currentUser.username} placeholder='请输入用户名'></Input>
						</Item>
						<Item
							name='phone'
							label='手机号：'
							rules={[
								{ required: true, message: '手机号不能为空!' },
								{ len: 11, message: '手机号长度必须为11位！' }
							]}
						>
							<Input placeholder='请输入手机号'></Input>
						</Item>
						<Item
							name='email'
							label='邮箱：'
						>
							<Input placeholder='请输入邮箱'></Input>
						</Item>
						<Item
							name='role'
							label='角色：'
						>
							<Select placeholder='请选择角色' style={{width: 200}}>
								{
									roles.map((r) => {
										return <Option key={r._id} value={r._id}>{r.name}</Option>
									})
								}
							</Select>
						</Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default User;