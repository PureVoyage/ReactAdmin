// product主页
import React, {Component} from 'react';
import {
	Card,
	Select,
	Input,
	Button,
	Table,
	message
} from 'antd';
import {
	PlusOutlined,
} from '@ant-design/icons';

import LinkButton from "../../components/link-button/linkButton";
import {reqProducts, reqSearchProduct, reqUpdateStatus} from "../../api";
import {PAGE_SIZE} from "../../utils/constant";

class ProductHome extends Component {
	
	constructor() {
		super();
		// 表格的列信息
		this.columns = [
			{
				title: '商品名称',
				dataIndex: 'name',
			},
			{
				title: '商品描述',
				dataIndex: 'desc',
			},
			{
				title: '价格',
				dataIndex: 'price',
				// 根据属性名获取当前行数据对象对应的属性
				render: (price) => '¥' + price
			},
			{
				width: 100,
				title: '状态',
				// dataIndex: 'status',
				render: (product) => {
					const {_id, status} = product;
					return (
						<span>
							<Button
								type='primary'
								onClick={() => {this.updateProductStatus(_id, status)}}
							>
								{status === 1 ? '下架' : '上架'}
							</Button>
							<br/>
							<span>{status === 1 ? '在售' : '已下架'}</span>
						</span>
					)
				}
			},
			{
				width: 100,
				title: '操作',
				render: (product) => {
					return (
						<span>
							<LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
							<br/>
							<LinkButton onClick={() => this.props.history.push('/product/add-update', product)}>修改</LinkButton>
						</span>
					)
				}
			},
		];
		this.state = {
			total: 0, // 商品总数，用于显示页面
			products: [], // 商品列表
			searchType: 'name', // 搜索
			currentPageNumber: 1 // 当前Table显示的页数
		};
		this.searchKey = '';
	}
	
	// 修改商品上架/下架状态
	async updateProductStatus(productId, originStatus) {
		const status = originStatus === 1 ? 2 : 1;
		const result = await reqUpdateStatus(productId, status);
		if (result.status === 0) {
			message.success('更新商品状态成功');
			// 刷新状态
			this.getProducts(this.state.currentPageNumber);
		}
	}
	
	// 获取指定页码的商品
	getProducts = async (pageNum) => {
		this.setState({loading: true});
		// 发送ajax获取数据
		let result;
		const {searchType} = this.state;
		if (this.searchKey === '') {
			result = await reqProducts(pageNum, PAGE_SIZE);
		} else {
			result = await reqSearchProduct(searchType, pageNum, PAGE_SIZE, this.searchKey);
		}
		// 更新页面
		this.setState({loading: false});
		if (result.status === 0) {
			const {total, list} = result.data;
			this.setState({
				total: total,
				products: list,
				loading: false, //是否正在加载
			})
		}
	}
	
	handleSearch = (value) => {
		this.searchKey = value;
		this.getProducts(1);
		// 将当前页面设为1
		this.setState({
			currentPageNumber: 1
		})
	}
	
	handleTableChange = (pagination) => {
		this.setState({
			currentPageNumber: pagination.current
		})
	}
	
	componentDidMount() {
		// 异步获取商品数据
		this.getProducts(1);
	}
	
	render() {
		const title = (
			<span>
				<Select defaultValue='name' style={{ width: 150 }} onChange={value => {this.setState({searchType: value})}}>
					<Select.Option value='name'>按名称搜索</Select.Option>
					<Select.Option value='desc'>按描述搜索</Select.Option>
				</Select>
				<Input.Search
					placeholder="关键字"
					enterButton="搜索"
					style={{ width: 200,  margin: '0 15px'}}
					onSearch={this.handleSearch}
				>
				</Input.Search>
			</span>
		)
		const extra = (
			<Button type='primary' onClick={() => {this.props.history.push('/product/add-update')}}>
				<PlusOutlined />
				添加商品
			</Button>
		)
		const {total, products, loading} = this.state
		return (
			<Card title={title} extra={extra}>
				<Table
					bordered
					rowKey='_id'
					columns={this.columns}
					dataSource={products}
					pagination={{
						current: this.state.currentPageNumber, // 当前第几页
						loading: loading,
						total: total,
						defaultPageSize: PAGE_SIZE,
						showQuickJumper: true,
						onChange: this.getProducts
					}} // 分页器，页面总数（后端分页），设置每页显示项数，跳转到某页组件
					onChange={this.handleTableChange}
				/>
			</Card>
		);
	}
}

export default ProductHome;