import React from "react";

import './Avatar.scss';

const Avatar = (props) => {
	return (
		<div className={`avatar ${props.className}`} style={props.style}>
			<img
				src={props.image} 
				alt={props.alt}
				style={{width: props.width ? props.width : 70, height: props.width ? props.width : 70}}
			/>
		</div>
	)
}

export default Avatar;