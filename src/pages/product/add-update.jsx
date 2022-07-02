// product信息的更新和修改页面路由
import React, {Component} from 'react';
import {
	Card,
	Form,
	Input,
	Cascader,
	Button,
	message
} from 'antd';
import {
	ArrowLeftOutlined,
} from '@ant-design/icons';

import LinkButton from "../../components/link-button/linkButton";
// import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
import {reqCategories, reqAddOrUpdateProduct} from "../../api";

const {Item} = Form;
const {TextArea} = Input;

class ProductAddUpdate extends Component {
	
	constructor() {
		super();
		this.bUpdate = false;
		this.product = {};
		this.state = {
			options: [],
		}
		this.editor = React.createRef(); // 用于获取富文本编辑器中的HTML格式标签文本
	}
	
	// 表单验证成功
	onFinish = async (values) => {
		
		// 1. 搜集所有输入数据，封装对象
		const {name, desc, price, categoryIds} = values;
		let pCategoryId, categoryId;
		if (categoryIds.length === 1) {
			pCategoryId = '0';
			categoryId = categoryIds[0];
		} else {
			pCategoryId = categoryIds[0];
			categoryId = categoryIds[1];
		}
		const detail = this.editor.current.getDetail();
		
		const product = {name, desc, price, detail, pCategoryId, categoryId};
		
		// 2. 调用接口请求函数：添加/更新
		if (this.bUpdate) {
			// 更新，需要额外指定id
			product['_id'] = this.product._id;
		}
		const result = await reqAddOrUpdateProduct(product);
		// 3. 结果提示
		if (result.status === 0) {
			message.success(`${this.bUpdate ? '更新' : '添加'}商品成功！`)
			this.props.history.goBack(); // 回到上一页
		} else {
			message.error(`${this.bUpdate ? '更新' : '添加'}商品失败！`)
		}
		
		console.log(result);
	}
	
	loadData = async (selectedOptions) => {
		// 得到选择的option对象
		const targetOption = selectedOptions[selectedOptions.length - 1];
		// 显示加载效果
		targetOption.loading = true; // load options lazily
		
		// 根据value中的ID值，发送ajax请求异步获取下一级列表
		const subCategories = await this.getCategories(targetOption.value);
		targetOption.loading = false;
		targetOption.children = subCategories;
		this.setState({
			options: [...this.state.options]
		})
		// if (subCategories && subCategories.length > 0) {
		// 	// 有子分类
		// 	targetOption.children = subCategories;
		// 	this.setState({
		// 		options: [...this.state.options]
		// 	})
		// } else {
		// 	// 无子分类
		// 	targetOption.isLeaf = true;
		// }
	};
	
	// ajax请求获取一级/二级分类
	getCategories = async (parentId) => {
		const result = await reqCategories(parentId);
		let options = [];
		if (result.status === 0) {
			// 更新列表数组
			options = result.data.map(c => {
				return {
					value: c._id,
					label: c.name,
					isLeaf: parentId !== '0'
				}
			});
			if (parentId === '0') {
				this.setState({options})
			}
		}
		return options; // 返回一级/二级列表
	}
	
	getSubCategories = async (pCategoryId, options) => {
		const subCategories = await this.getCategories(pCategoryId);
		const targetOption = options.find(o => o.value === pCategoryId);
		targetOption.children = subCategories;
	}
	
	async componentDidMount() {
		const options = await this.getCategories('0'); // 异步获取一级列表
		// 更新页面下，ajax请求获取二级分类，并关联到对应的一级分类中
		const {pCategoryId} = this.product;
		if (this.bUpdate && pCategoryId !== '0') {
			this.getSubCategories(pCategoryId, options);
		}
	}
	
	render() {
		// 指定Item布局的配置对象
		const formItemLayout = {
			labelCol: { // 指定左侧label的宽度
				xs: { span: 8 },
				sm: { span: 2 },
			},
			wrapperCol: { // 指定右侧输入框的宽度
				xs: { span: 12 },
				sm: { span: 8 },
			},
		};
		const title = (
			<span>
				<LinkButton style={{marginRight: '15px'}} onClick={() => {this.props.history.push('/product')}}>
					<ArrowLeftOutlined />
				</LinkButton>
				<span>
					{this.props.location.state === undefined ? '添加商品' : '更新商品'}
				</span>
			</span>
		)
		// 价格自定义验证回调函数
		const validatePrice = (rule, value, callback) => {
			const number = Number(value);
			// 价格必须为数字
			if (Number.isInteger(number) && number > 0) {
				return Promise.resolve();
			} else if (!Number.isInteger(number)) {
				return Promise.reject('价格必须是数值格式')
			} else {
				return Promise.reject('价格必须大于0')
			}
		}
		const product = this.props.location.state || {};
		const categoryIds = [];
		if (JSON.stringify(product) !== '{}') {
			this.bUpdate = true;
			this.product = product;
			const {pCategoryId, categoryId} = product
			if (pCategoryId === '0') {
				// 一级分类商品
				categoryIds.push(categoryId);
			} else {
				// 二级分类商品
				categoryIds.push(pCategoryId);
				categoryIds.push(categoryId);
			}
		}
		return (
			<Card title={title}>
				<Form {...formItemLayout} ref={this.formRef} onFinish={this.onFinish}>
					<Item
						label='商品名称：'
						name='name'
						initialValue={product.name}
						rules={[
							{required: true, message: '必须输入商品名称'},
						]}
					>
						<Input placeholder='请输入商品名称' />
					</Item>
					<Item
						label='商品描述：'
						name='desc'
						initialValue={product.desc}
						rules={[
							{required: true, message: '必须输入商品描述'},
						]}
					>
						<TextArea placeholder='请输入商品描述' autosize={{minRows: 2, maxRows: 8}} />
					</Item>
					<Item label='商品价格：'
					      name='price'
					      initialValue={product.price}
					      rules={[
						      {required: true, message: '必须输入商品名称'},
						      {validator: validatePrice}
					      ]}
					>
						<Input type='number' placeholder='请输入商品价格' addonAfter='元' />
					</Item>
					<Item label='商品分类：' name='categoryIds' initialValue={categoryIds}>
						<Cascader
							options={this.state.options} // 需要显示的列表数组
							loadData={this.loadData} // 需要显示二级列表时调用
							changeOnSelect
						/>
					</Item>
					{/* <Item label='商品图片：'> */}
					{/* 	<PicturesWall /> */}
					{/* </Item> */}
					<Item label='商品详情：' wrapperCol={{span: 20}}>
						<RichTextEditor ref={this.editor} detail={product.detail} />
					</Item>
					<Item>
						<Button type='primary' htmlType='submit'>提交</Button>
					</Item>
				</Form>
			</Card>
		);
	}
}

export default ProductAddUpdate;