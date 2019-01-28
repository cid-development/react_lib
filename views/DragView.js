/******************************************************************************
 * DragView Component
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
import DragControl from '../utils/DragControl';


//============================================================================= DragView Component
export default class DragView extends Component {
	constructor(props){
		super(props);

		this.state = {
			isDown		: false,
			isDragging	: false,
			posX		: props.posX,
			posY		: props.posY,
		}
		this.move = {x:0, y:0};
		this.drag = {x:0, y:0};
		this.start = {x:0, y:0};
	}


	static defaultProps = {
		className	: 'drag-view',

		useRect		: false,
		posX: 0,
		posY: 0,
		minX: 0,
		maxX: 1000,
		minY: 0,
		maxY: 1000,
		// rect: [0, 0, 0, 0],
		// stepsX: 0,
		grid: 0,
		dragLimit: 10,
		// dragX: true,
		// dragY: true,
		// drag: 'xy',

		onDown	: null,
		onUp	: null,
		onDragStart		: null,
		onMove	: null,
		onClick	: null,
	}


	componentDidMount(){
		let p = this.props;
		let s = this.state;

		this.control = new DragControl(this.refs.view, {
			onDragStart: e => this.setState({isDragging:true}),
			onDown: e => this.onDown(e),
			onMove: e => this.onMove(e),
			onUp: e => this.setState({isDown:false, isDragging:false}),
			onClick: e => console.log('single click!'),
			dragLimit: p.dragLimit,
		})

		let px = (s.posX < p.minX)? p.minX : (s.posX > p.maxX)? p.maxX : s.posX;
		let py = (s.posY < p.minY)? p.minY : (s.posY > p.maxY)? p.maxY : s.posY;
		if (px !== s.posX || py !== s.posY)	this.setState({posX:px, posY:py});
	}


	onDown(e){
		this.start.x = this.state.posX;
		this.start.y = this.state.posY;
		this.drag.x = this.drag.y = 0;
		this.move.x = this.move.y = 0;
		this.setState({isDown:true, isDragging:false});
	}


	onMove(e){
		let p = this.props;
		let s = this.state;

		var px = this.start.x + e.drag.x;
		if (p.grid) px = Math.round(px / p.grid) * p.grid;
		px = px < p.minX? p.minX : px > p.maxX? p.maxX : px;

		var py = this.start.y + e.drag.y;
		if (p.grid) py = Math.round(py / p.grid) * p.grid;
		py = py < p.minY? p.minY : py > p.maxY? p.maxY : py;

		this.move.x = px - s.posX;
		this.move.y = py - s.posY;

		this.drag.x += this.move.x;
		this.drag.y += this.move.y;

		this.setState({posX:px, posY:py});
	}


	componentWillUpdate(e){
		let p = this.props;
		let s = this.state;
		let px = (s.posX < p.minX)? p.minX : (s.posX > p.maxX)? p.maxX : s.posX;
		let py = (s.posY < p.minY)? p.minY : (s.posY > p.maxY)? p.maxY : s.posY;
		if (px !== s.posX || py !== s.posY)	this.setState({posX:px, posY:py});
	}


	render(){
		let p = this.props;
		let s = this.state;
		let c = p.className + (s.isDown? ' down' : '') + (s.isDragging? ' drag' : '');
		let t = 'translateX(' + s.posX + 'px) translateY(' + s.posY + 'px)';

		return (
			<div className={c} id={p.id} ref='view' style={{...p.style, transform:t}} >
				{p.children}
			</div>
		)
	}
}
