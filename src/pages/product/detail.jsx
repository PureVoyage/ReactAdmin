// product详情页
import React, {Component} from 'react';
import {
	Card,
	List,
} from 'antd'
import {
	ArrowLeftOutlined,
} from '@ant-design/icons';

import LinkButton from "../../components/link-button/linkButton";
import {BASE_IMG_URL} from "../../utils/constant";
import {reqCategoryName} from "../../api";

const Item = List.Item;

class ProductDetail extends Component {
	
	state = {
		cNameFirst: '', // 一级分类名称
		cNameSecond: '' // 二级分类名称
	}
	
	async componentDidMount() {
		// 异步获取当前商品的分类名
		const {pCategoryId, categoryId} = this.props.location.state.product;
		if (pCategoryId === '0') {
			const resultFirst = await reqCategoryName(categoryId);
			const cNameFirst = resultFirst.data.name;
			this.setState({cNameFirst})
		} else {
			/* await必须等待右侧运行完毕才能继续执行，多个await效率太低 */
			// const resultFirst = await reqCategoryName(pCategoryId);
			// const resultSecond = await reqCategoryName(categoryId);
			// const cNameFirst = resultFirst.data.name;
			// const cNameSecond = resultSecond.data.name;
			// this.setState({cNameFirst, cNameSecond})
			/* 通过Promise的all方法，一次新接收多个Promise，只需await一次，效率更高 */
			const results = await Promise.all([reqCategoryName(pCategoryId), reqCategoryName(categoryId)])
			const cNameFirst = results[0].data.name;
			const cNameSecond = results[1].data.name;
			this.setState({cNameFirst, cNameSecond})
		}
	}
	
	render() {
		const title = (
			<span>
				<LinkButton onClick={() => this.props.history.goBack()}>
					<ArrowLeftOutlined style={{marginRight: '15px'}}/>
				</LinkButton>
				<span>商品详情</span>
			</span>
		)
		const extra = (
			<span></span>
		)
		// 获取home组件传来的product
		const {product} = this.props.location.state;
		const {cNameFirst, cNameSecond} = this.state;
		return (
			<Card title={title} extra={extra} className='product-detail'>
				<List>
					<Item>
						<span className='left'>商品名称：</span>
						<span>{product.name}</span>
					</Item>
					<Item>
						<span className='left'>商品描述：</span>
						<span>{product.desc}</span>
					</Item>
					<Item>
						<span className='left'>商品价格：</span>
						<span>{product.price}</span>
					</Item>
					<Item>
						<span className='left'>所属分类：</span>
						<span>{cNameFirst} {cNameSecond ? ' --> ' + cNameSecond : ''}</span>
					</Item>
					<Item>
						<span className='left'>所属分类：</span>
						<span>
							{
								product.imgs.map(img => (
									<img
										key={img}
										className='product-img'
										src={BASE_IMG_URL + img}
										alt="img"
									/>
								))
							}
						</span>
					</Item>
					<Item>
						<span className='left'>商品详情：</span>
						<span dangerouslySetInnerHTML={{__html: product.detail}}></span>
					</Item>
				</List>
			</Card>
		);
	}
}

export default ProductDetail;