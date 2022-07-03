/*
	Redux核心的管理对象：Store
 */

import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from 'redux-thunk'

import reducer from './reducer'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
