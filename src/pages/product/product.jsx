import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import ProductHome from "./home";
import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";

import './product.less'

class Product extends Component {
	render() {
		return (
			<Switch>
				{/* 防止模糊匹配只匹配第一个 */}
				<Route exact path='/product' component={ProductHome} />
				<Route path='/product/add-update' component={ProductAddUpdate} />
				<Route path='/product/detail' component={ProductDetail} />
				<Redirect to='/product' />
			</Switch>
		);
	}
}

export default Product;