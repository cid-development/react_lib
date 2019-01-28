/******************************************************************************
 * DragRect Component
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
// import DragControl from '../utils/DragControl';


//============================================================================= DragRect Component
export default class DragRect extends Component {
	constructor(props){
		super(props);

		this.state = {
			isDown		: false,
			isDragging	: false,
			posX		: props.posX,
			posY		: props.posY,
			width		: 0,
			height		: 0,
		}
		this.move = {x:0, y:0};
		this.area = {x:0, y:0};
		this.start = {x:0, y:0};
	}


	static defaultProps = {
		className: 'drag-view',

		offset	: 5,		//border offset for touch dedection

		useRect	: false,
		posX	: 0,
		posY	: 0,
		minX	: 0,
		maxX	: 1000,
		minY	: 0,
		maxY	: 1000,
		// rect: [0, 0, 0, 0],
		// stepsX: 0,
		grid	: 0,
		// dragLimit: 10,
		// dragX: true,
		// dragY: true,
		// drag: 'xy',

		onDown	: null,
		onUp	: null,
		onDragStart		: null,
		onMove	: null,
		onClick	: null,

		onChange : null,
	}


	componentDidMount(){
		let p = this.props;
		let s = this.state;

		s.posX = this.refs.view.offsetLeft;
		s.posY = this.refs.view.offsetTop;

		s.width = this.refs.view.clientWidth;
		s.height = this.refs.view.clientHeight;

		this.moveBind = this.onMove.bind(this);
		this.upBind = this.onUp.bind(this);

		let o = this.props.offset;
		let a = this.refs.area;

		a.style.position = 'absolute';
		a.style.top = -o + 'px';
		a.style.left = -o + 'px';
		a.style.width = s.width + o + o + 'px';
		a.style.height = s.height + o + o + 'px';

		this.onChange();
	}


	onDown(e){
		let s = this.state;
		let o = this.props.offset;

		let w = s.width;
		let h = s.height;
		let x = e.nativeEvent.offsetX - o;
		let y = e.nativeEvent.offsetY - o;

		this.area.x = x < o? 'l' : x > w-o? 'r' : '';
		this.area.y = y < o? 't' : y > h-o? 'b' : '';

		this.startX = e.clientX - s.posX;
		this.startY = e.clientY - s.posY;

		this.startW = e.clientX + (this.area.x === 'l'? s.width : -s.width);
		this.startH = e.clientY + (this.area.y === 't'? s.height : -s.height);

		s.isDown = true;

		window.addEventListener('mousemove', this.moveBind);
		window.addEventListener('mouseup', this.upBind);
	}


	onMove(e){
		if (!this.state.isDown) return;

		let s = this.state;
		let x = this.area.x;
		let y = this.area.y;

		switch (x){
		case '':
			if (y === '') s.posX = e.clientX - this.startX;
			break;
		case 'l':
			s.posX = e.clientX - this.startX;
			s.width = this.startW - e.clientX;
			break;
		case 'r':
			s.width = e.clientX - this.startW;
			break;
		}

		switch (y){
		case '':
			if (x === '') s.posY = e.clientY - this.startY;
			break;
		case 't':
			s.posY = e.clientY - this.startY;
			s.height = this.startH - e.clientY;
			break;
		case 'b':
			s.height = e.clientY - this.startH;
			break;
		}

		this.onChange();
	}


	onChange(){
		let s = this.state;
		let o = this.props.offset;

		this.refs.view.style.left = s.posX + 'px';
		this.refs.view.style.top = s.posY + 'px';

		this.refs.view.style.width = s.width + 'px';
		this.refs.view.style.height = s.height + 'px';

		this.refs.area.style.width = (s.width + o + o) + 'px';
		this.refs.area.style.height = (s.height + o + o) + 'px';

		if (this.props.onChange) this.props.onChange(this);
	}

	
	onUp(e){
		this.state.isDown = false;
		window.removeEventListener('mousemove', this.moveBind);
		window.removeEventListener('mouseup', this.upBind);
	}


	render(){
		let p = this.props;
		let s = this.state;
		let c = p.className + (s.isDown? ' down' : '') + (s.isDragging? ' drag' : '');

		return (
			<div className={c} id={p.id} ref='view' >
				{p.children}
				<div ref='area' onMouseDown={e => this.onDown(e)} />
			</div>
		)
	}
}
