import React from 'react';

import './linkButton.less'

const LinkButton = props => {
	return <button className='link-button' {...props}>{props.children}</button>
}

export default LinkButton;
