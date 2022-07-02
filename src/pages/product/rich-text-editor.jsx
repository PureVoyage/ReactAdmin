import React, {Component} from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css' // 样式

class RichTextEditor extends Component {
	
	constructor(props) {
		super(props);
		const html = props.detail;
		if (html) {
			// 更新情况
			const contentBlock = htmlToDraft(html);
			if (contentBlock) {
				// 添加商品的原有详情信息
				const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
				const editorState = EditorState.createWithContent(contentState);
				this.state = {
					editorState,
				};
			}
		} else {
			// 添加情况
			this.state = {
				// 初始化一个没有内容的空编辑对象
				editorState: EditorState.createEmpty(),
			}
		}
	}
	
	// 编辑器变化时，实时更新state
	onEditorStateChange = (editorState) => {
		this.setState({
			editorState,
		});
	};
	
	// 返回输入数据对应的HTML格式文本
	getDetail = () => {
		return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
	}
	
	uploadImageCallBack = (file) => {
		return new Promise(
			(resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', '/manage/img/upload');
				xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
				const data = new FormData();
				data.append('image', file);
				xhr.send(data);
				xhr.addEventListener('load', () => {
					const response = JSON.parse(xhr.responseText);
					const url = response.data.url; // 得到图片在数据库中的地址
					resolve({data: {link: url}});
				});
				xhr.addEventListener('error', () => {
					const error = JSON.parse(xhr.responseText);
					reject(error);
				});
			}
		);
	}
	
	render() {
		const { editorState } = this.state;
		return (
			<div>
				<Editor
					editorState={editorState}
					wrapperClassName="demo-wrapper"
					editorClassName="demo-editor"
					editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
					onEditorStateChange={this.onEditorStateChange}
					toolbar={{ // 库有点老了，有些功能失灵
						inline: { inDropdown: true },
						list: { inDropdown: true },
						textAlign: { inDropdown: true },
						link: { inDropdown: true },
						history: { inDropdown: true },
						image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
					}}
				/>
				{/* HTML标签格式预览 */}
				{/* <textarea */}
				{/* 	disabled */}
				{/* 	value={draftToHtml(convertToRaw(editorState.getCurrentContent()))} */}
				{/* /> */}
			</div>
		);
	}
}

export default RichTextEditor;