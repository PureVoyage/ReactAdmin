import React, {Component} from 'react';
import {
	Card,
	Table,
	Button,
	message,
	Modal,
	Form,
	Select,
	Input
} from 'antd';
import {
	PlusOutlined,
	ArrowRightOutlined
} from '@ant-design/icons';

import LinkButton from "../../components/link-button/linkButton";
import {reqCategories, reqAddCategory, reqUpdateCategory} from "../../api";
import {PAGE_SIZE} from "../../utils/constant";


const Item = Form.Item;
const Option = Select.Option;

class Category extends Component {
	
	constructor() {
		super();
		this.columns = [
			{
				title: '类别名称',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '操作',
				key: 'action',
				width: 300,
				render: (category) => (
					<span>
						<LinkButton
							onClick={() => {
								this.setState({updateModalVisible: true});
								this.category = category;
							}
						}
						>修改分类</LinkButton>
						&nbsp;&nbsp;&nbsp;
						<LinkButton onClick={() => this.showSubCategories(category)} style={{display: category.parentId === '0' ? 'inline-block': 'none'}}>
							查看子分类
						</LinkButton>
					</span>
				),
			},
		]
		this.state = {
			loading: false, // 是否正在获取数据中
			categories: [], // 一级分类列表
			parentId: '0', // 当前需要显示的分类的parentId，用于区分一级和二级列表
			parentName: '一级分类', // 当前分类的父类名称，用于显示
			addModalVisible: false,
			updateModalVisible: false
		}
		this.updateInputRef = React.createRef();
		this.addParentRef = React.createRef();
		this.addInputRef = React.createRef();
		this.addParentId = ''; // 存储添加分类列表中的父类
	}
	
	// 显示一级分类的子分类列表
	showSubCategories = (category) => {
		// 更新状态, setState是异步的
		this.setState({
			parentId: category._id,
			parentName: category.name
		}, () => {
			// 获取二级分类数据
			this.getCategories();
		})
	}
	
	// 显示一级分类列表
	showCategories = () => {
		// 更新状态
		this.setState({
			parentId: '0',
			parentName: '一级分类'
		}, () => {
			this.getCategories();
		});
	}
	
	// 获取一级/二级分类数据
	getCategories = async () => {
		// 发请求前，显示loading
		this.setState({loading: true});
		// 获取数据
		const result = await reqCategories(this.state.parentId);
		// 获取数据后，隐藏loading
		this.setState({loading: false});
		if (result.status === 0) {
			this.setState({
				categories: result.data,
			})
		} else {
			message.error('获取分类列表失败');
		}
	}
	
	// 隐藏对话框
	hiddenModal = () => {
		this.setState({
			addModalVisible: false,
			updateModalVisible: false
		})
	}
	
	addParentChange = (value) => {
		this.addParentId = value;
	}
	
	// 添加分类
	addCategory = async () => {
		// 获取数据
		const categoryName = this.addInputRef.current.input.value;
		const parentId = this.addParentId;
		// 表单验证
		if (categoryName.length === 0) {
			message.error('分类名称必须输入!');
			return;
		} else if (categoryName.length < 2) {
			message.error('分类名称至少需要2位!');
			return;
		}
		// 隐藏对话框
		this.hiddenModal();
		// 发送添加请求
		const result = await reqAddCategory(categoryName, parentId);
		// 刷新列表
		if (result.status === 0) {
			this.getCategories();
		}
	}
	
	// 更新分类
	updateCategory = async () => {
		const categoryId = this.category._id;
		const categoryName = this.updateInputRef.current.input.value;
		// 表单验证
		if (categoryName.length === 0) {
			message.error('分类名称必须输入!');
			return;
		} else if (categoryName.length < 2) {
			message.error('分类名称至少需要2位!');
			return;
		}
		// 隐藏对话框
		this.hiddenModal();
		// 发送请求
		const result = await reqUpdateCategory(categoryId, categoryName);
		// 重新显示列表
		if (result.status === 0) {
			this.getCategories();
		}
	}
	
	componentDidMount() {
		this.getCategories();
	}
	
	onFinish = (values) => {
		console.log('Success:', values);
	};
	
	render() {
		const {categories, loading, parentId, parentName, addModalVisible, updateModalVisible} = this.state;
		const currentName = this.category === undefined ? '' : this.category.name;
		this.addParentId = parentId;
		// Card左侧部分
		const title = parentId === '0' ? '一级分类列表' : (
			<span>
				<LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
				<ArrowRightOutlined style={{margin: '0 5px'}}/>
				<span>{parentName}</span>
			</span>
		);
		//Card右侧部分
		const extra = (
			// 点击后显示添加的对话框
			<Button type='primary' onClick={() => {this.setState({addModalVisible: true})}}>
				<PlusOutlined />
				添加
			</Button>
		);
		return (
			<div>
				<Card title={title} extra={extra}>
					<Table
						rowKey={'_id'}
						bordered
						columns={this.columns}
						dataSource={categories}
						pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}} // 分页器，设置每页显示项数，跳转到某夜组件
						loading={loading} // 数据未加载完成时显示Loading样式
					/>
				</Card>
				<Modal title="添加分类" visible={addModalVisible} onOk={this.addCategory} onCancel={this.hiddenModal}>
					<Form onFinish={this.onFinish}>
						<Item>
							<Select ref={this.addParentRef} defaultValue={parentName} key={parentName} onChange={this.addParentChange}>
								<Option value={parentId}>{parentName}</Option>
								{
									categories.map(c => <Option key={c._id} value={c._id} style={{display: parentId === '0' ? 'block' : 'none'}}>{c.name}</Option>)
								}
							</Select>
						</Item>
						<Item
							name='addCategory'
							rules={[
								{ required: true, message: '分类名称必须输入!' },
								{ min: 2, message: '分类名称至少需要2位!' },
							]}
						>
							<Input ref={this.addInputRef} placeholder='请输入分类名称'></Input>
						</Item>
					</Form>
				</Modal>
				<Modal title="更新分类" visible={updateModalVisible} onOk={this.updateCategory} onCancel={this.hiddenModal}>
					<Form>
						<Item
							rules={[
								{ required: true, message: '分类名称必须输入!' },
								{ min: 2, message: '分类名称至少需要2位!' },
							]}
						>
							{/* 使用key值可以保证全局修改defaultValue */}
							<Input ref={this.updateInputRef} defaultValue={currentName} key={currentName} placeholder='请输入分类名称'></Input>
						</Item>
					</Form>
				</Modal>
			</div>
		);
	}
}

export default Category;