/*
	入口JS文件
 */
import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux';

import store from "./redux/store";

const root = createRoot(document.querySelector('#root'));

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</Provider>
);
