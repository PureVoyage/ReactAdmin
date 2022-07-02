import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, {Component} from 'react';

/*
	用于图片上传的组件
 */
class PicturesWall extends Component {
	
	state = {
		fileList: [
			{
				uid: '-1',
				name: 'image.png',
				status: 'done',
				url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			},
		]
	}
	
	onChange = (newFileList) => {
		console.log(newFileList)
		this.setState({
			fileList: newFileList
		});
	};
	
	onPreview = async (file) => {
		let src = file.url;
		
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				
				reader.onload = () => resolve(reader.result);
			});
		}
		
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};
	
	render() {
		const {fileList} = this.state;
		return (
			<ImgCrop rotate>
				<Upload
					accept='image/*' // 接受的文件类型（后缀名）
					action="/manage/img/upload" // 上传文件的服务器地址
					listType="picture-card" // 预览样式
					name='image'
					fileList={fileList}
					onChange={this.onChange}
					onPreview={this.onPreview}
				>
					{fileList.length < 5 && '+ Upload'}
				</Upload>
			</ImgCrop>
		);
	}
}

export default PicturesWall;
