/*
	应用的跟组件
 */
import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";
import './App.less'

export default class App extends Component {
	
	render() {
		return (
			<Switch>
				<Route path='/login' component={Login}></Route>
				<Route path='/' component={Admin}></Route>
			</Switch>
		);
	}
}

