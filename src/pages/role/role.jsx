import React, {Component} from 'react';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	Input,
	message,
	Tree
} from 'antd';

import {PAGE_SIZE} from "../../utils/constant";
import {reqRoles, reqAddRoles, reqUpdateAuth} from "../../api";
import menuList from "../../config/menuConfig";

const Item = Form.Item;

class Role extends Component {
	
	constructor() {
		super();
		this.columns = [
			{
				title: '角色名称',
				dataIndex: 'name'
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				render: (time) => {
					const date = new Date();
					date.setTime(time);
					return time === undefined ? time : date.toLocaleString();
				}
			},
			{
				title: '授权时间',
				dataIndex: 'auth_time',
				render: (time) => {
					const date = new Date();
					date.setTime(time);
					return time === undefined ? time : date.toLocaleString();
				}
			},
			{
				title: '授权人',
				dataIndex: 'auth_name'
			}
		];
		this.treeData = [
			{
				title: 'parent 1',
				key: '0-0',
				children: [
					{
						title: 'parent 1-0',
						key: '0-0-0',
						disabled: true,
						children: [
							{
								title: 'leaf',
								key: '0-0-0-0',
								disableCheckbox: true,
							},
							{
								title: 'leaf',
								key: '0-0-0-1',
							},
						],
					},
					{
						title: 'parent 1-1',
						key: '0-0-1',
						children: [
							{
								title: (
									<span
										style={{
											color: '#1890ff',
										}}
									>
                sss
              </span>
								),
								key: '0-0-1-0',
							},
						],
					},
				],
			},
		];
		this.state = {
			roles: [], // 所有角色数据
			role: {}, // 当前被选中的角色
			addModalVisible: false, // 添加角色对话框可见性
			authModalVisible: false, // 角色权限设置对话框可见性
			checkedKeys: [] // 当前角色Tree中的权限选中项
		};
		this.addRoleInputRef = React.createRef();
		this.authRoleInputRef = React.createRef();
	}
	
	rowClick = (role) => {
		this.setState({
			role,
			checkedKeys: role.menus
		});
	}
	
	// 获取所有的角色信息
	getRoles = async () => {
		const result = await reqRoles();
		if (result.status === 0) {
			const roles = result.data;
			this.setState({
				roles,
			})
		}
	}
	
	// 添加新的角色
	addRole = async () => {
		const username = this.addRoleInputRef.current.input.value;
		const result = await reqAddRoles(username);
		if (result.status === 0) {
			message.success('添加角色成功');
			// 更新页面
			this.getRoles();
			this.setState({
				addModalVisible: false
			})
			
		} else {
			message.error('添加角色失败');
		}
	}
	
	// 树权限选择框被选中事件
	treeCheck = checkedKeys => {
		this.setState({
			checkedKeys
		});
	};
	
	// 权限修改提交
	updateAuth = async () => {
		const {role, checkedKeys} = this.state;
		const currentTime = Math.round(new Date().getTime()/1000);
		const result = await reqUpdateAuth(role._id, checkedKeys, currentTime, role.auth_name);
		if (result.status === 0) {
			message.success('更新角色权限成功');
			// 更新数据
			this.getRoles();
		} else {
			message.error('更新角色权限失败');
		}
	}
	
	componentDidMount() {
		this.getRoles();
	}
	
	render() {
		const {roles, role, addModalVisible, authModalVisible, checkedKeys} = this.state;
		// 角色权限对话框样式
		const formItemLayout = {
			labelCol: { // 指定左侧label的宽度
				span: 4
			},
			wrapperCol: { // 指定右侧输入框的宽度
				span: 18
			},
		};
		const title = (
			<span>
				<Button type='primary' style={{marginRight: '15px'}} onClick={() => {this.setState({addModalVisible: true})}}>创建角色</Button>
				<Button type='primary' disabled={!role._id} onClick={() => {this.setState({authModalVisible: true})}}>设置角色权限</Button>
			</span>
		)
		return (
			<div>
				<Card title={title}>
					<Table
						rowKey={'_id'} // 行唯一的标识
						bordered
						columns={this.columns}
						dataSource={roles}
						// loading={loading} // 数据未加载完成时显示Loading样式
						rowSelection={{
							type: 'radio',
							selectedRowKeys: [role._id],
							onSelect: (role) => {
								this.rowClick(role);
							}
						}}
						onRow={role => {
							return {
								onClick: () => this.rowClick(role)
							}
						}}
						pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}} // 分页器，设置每页显示项数，跳转到某夜组件
					/>
				</Card>
				<Modal title="添加角色" visible={addModalVisible} onOk={this.addRole} onCancel={() => {this.setState({addModalVisible: false})}}>
					<Form>
						<Item
							name='name'
							rules={[
								{ required: true, message: '角色名称必须输入!' },
							]}
						>
							{/* 使用key值可以保证全局修改defaultValue */}
							<Input ref={this.addRoleInputRef} placeholder='请输入角色名称'></Input>
						</Item>
					</Form>
				</Modal>
				<Modal title="设置角色权限" visible={authModalVisible} onOk={this.updateAuth} onCancel={() => {this.setState({authModalVisible: false})}}>
					<Form initialValues={{'auth': role.name}}>
						<Item name='auth' label='角色名称' {...formItemLayout}>
							{/* 使用key值可以保证全局修改defaultValue */}
							<Input ref={this.authRoleInputRef} disabled></Input>
						</Item>
						<Item>
							<Tree
								ref={this.authRoleInputRef}
								checkable
								defaultExpandAll={true}
								// defaultSelectedKeys={['0-0-0', '0-0-1']}
								key={role.menus}
								defaultCheckedKeys={checkedKeys}
								onCheck={this.treeCheck}
								treeData={menuList}
							/>
						</Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default Role;