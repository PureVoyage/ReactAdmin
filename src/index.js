/*
	入口JS文件
 */
import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";

const root = createRoot(document.querySelector('#root'));

root.render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>
);
