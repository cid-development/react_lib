/******************************************************************************
 * ScaledView Component
 * version: 1.0.2, release: 07.09.2018
 * author: albert lang, albert@jumptonmorrow.com
 * ----------------------------------------------------------------------------
 * description:
 * 
 * dependencies: none
 * 
 * todos:
 * 
******************************************************************************/

import React, { Component } from 'react';


//============================================================================= ScaledView Component
export default class ScaledView extends Component {
	constructor(props){
		super(props);

		this.state = {
			x: 0,
			y: 0,
			scale: 1,
		}
	}


	static defaultProps = {
		width		: 1080,
		height		: 1920,
		minWidth	: 0,
		maxWidth	: 0,
		minHeight	: 0,
		maxHeight	: 0,
		fitHeight	: false,
		fitWidth	: false,
		// padding		: [0, 0, 0, 0],
	}


	componentDidMount(){
		let p = this.props;
		let v = this.refs.view;
		v.style.transformOrigin = '0 0';
		v.style.width = p.width + 'px';
		v.style.height = p.height + 'px';

		window.addEventListener('resize', e => this.onResize());
		this.onResize();

		// setTimeout(() => {
		// 	this.onResize();
		// }, 2000);
	}


	onResize(){
		let p = this.props;
		// let w = window.innerWidth - p.padding[1] - p.padding[3];
		let w = window.innerWidth;
		if (w < p.minWidth) w = p.minWidth;
		if (p.maxWidth && w > p.maxWidth) w = p.maxWidth;

		// let h = window.innerHeight - p.padding[0] - p.padding[2];
		let h = window.innerHeight;
		if (h < p.minHeight) h = p.minHeight;
		if (p.maxHeight && h > p.maxHeight) h = p.maxHeight;
		
		let r = w / h;
		var s, x;

		if (r < this.ratio || (p.fitWidth && !p.fitHeight)){
			s = w / p.width;
			// x = p.padding[3];
			x = 0;
		}else{
			s = h / p.height;
			// x = p.padding[3] + (w - (p.width * s)) / 2;
			x = (w - (p.width * s)) / 2;
		}

		this.setState({x, scale:s, width:s * p.width, height:s * p.height});
	}


	render(){
		let p = this.props;
		let s = this.state;
		let tr = 'translateX(' + s.x + 'px)';
		let sc = 'scale(' + s.scale + ')';

		return (
			<div className='unscaled-wrapper' id={p.id}
				style={{transform:tr, width:s.width+'px', height:s.height+'px'}}>
				<div className='scaled-view' ref='view' style={{transform:sc}}>
					{p.children}
				</div>
			</div>
		)
	}
}