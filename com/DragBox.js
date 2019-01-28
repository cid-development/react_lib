/******************************************************************************
 * DragBox Component
 * version: 1.0.1, release: 07.09.2018
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
import './DragBox.scss';


//============================================================================= DragBox Component
export default class DragBox extends Component {
	constructor(props){
		super(props);

		this.state = {
			isDown	: false,
			// value	: props.value,
		}
		this.value = props.value;

		// console.log('###', window.devicePixelRatio);
	}


	static defaultProps = {
		minX: 0,
		maxX: 600,
		minY: 0,
		maxY: 0,
		value: 100,
		step: 10,
		enabledX	:true,
		enabledY	:true,
	}


	componentDidMount(){
		this.moveBind = this.onMove.bind(this);
		this.upBind = this.onUp.bind(this);
		this.touchBind = this.onTouchMove.bind(this);
	}

	onDown(e){
		if (this.touchDown) return;		//already touched

		this.pos = this.value;

		if (e.type === 'touchstart'){
			this.touchPos = {x:e.touches[0].clientX, y:e.touches[0].clientY};
			document.addEventListener('touchmove', this.touchBind);
			document.addEventListener('touchend', this.upBind);
			this.touchDown = true;

		}else{
			document.addEventListener('mousemove', this.moveBind);
			document.addEventListener('mouseup', this.upBind);
		}

		this.setState({isDown:true});
	}


	onMove(e){
		this.pos += e.movementX;
		this.setValue(this.pos);
	}

	onTouchMove(e){
		let x0 = e.touches[0].clientX;
		// let y0 = e.touches[0].clientY;
		let mx = (x0 - this.touchPos.x);

		this.pos += mx;
		this.setValue(this.pos);
		// my = (y0 - this.touchPos.y) / this.pixelSize;
		this.touchPos.x = x0;
		// this.touchPos.y = y0;
	}

	setValue(val){
		let p = this.props;
		this.value = val < p.minX? p.minX : val > p.maxX? p.maxX : val;
		// this.setState({value});
		this.refs.box.style.transform = 'translateX(' + this.value + 'px)';
	}


	onUp(e){
		this.touchDown = false;
		this.setState({isDown:false});
		document.removeEventListener('mousemove', this.moveBind);
		document.removeEventListener('mouseup', this.upBind);

		document.removeEventListener('touchmove', this.touchBind);
		document.removeEventListener('touchend', this.upBind);
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div
				onMouseDown={e => this.onDown(e)}
				onTouchStart={e => this.onDown(e)}

				className={'drag-box' + (s.isDown? ' drag' : '')}
				id={p.id}
				// style={{transform:'translateX(' + s.value + 'px)'}}
				ref='box'
			>
			{/* {s.value} */}
			</div>
		)
	}
}
