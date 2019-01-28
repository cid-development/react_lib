/******************************************************************************
 * SwipeControl Component
 * version: 1.0.2, release: 06.01.2019
 * author: albert lang, albert@jumptonmorrow.com
 * ----------------------------------------------------------------------------
 * description:
 * 
 * dependencies: none
 * 
 * todos:
 * 
******************************************************************************/

import DragControl from './DragControl';

const name = 'SwipeControl';
const version = '1.0.1';


export default class SwipeControl extends DragControl {
	constructor(target, props){

		// var pnew = Object.assign({}, SwipeControl.defaultProps);	//copy defaultProps
		// Object.assign(pnew, props);		//set custom props
		var pnew = {...SwipeControl.defaultProps, ...props};			//copy defaultProps

		super(target, pnew);

		this.direction = 'none';

		let p = this.props;
		if (p.onDragStart) p._onDragStart = p.onDragStart;
		if (p.onDragStop) p._onDragStop = p.onDragStop;
		if (p.onDown) p._onDown = p.onDown;

		p.onDragStart = this.onDragStart.bind(this);
		p.onDragStop = this.onDragStop.bind(this);
		p.onDown = e => {
			this.direction = 'none';
			if (p._onDown) p._onDown(this);
		}

		this.fnc = {
			'left'	: p.onSwipeLeft,
			'right' : p.onSwipeRight,
			'up'	: p.onSwipeUp,
			'down'	: p.onSwipeDown,
		}
	}


	static defaultProps = {
		onSwipeLeft 	: null,
		onSwipeRight	: null,
		onSwipeUp		: null,
		onSwipeDown		: null,
		onSwipe			: null,		//swipe event for all directions

		speedLimit		: 0.1,		//minimum speed for swipe event
	}


	onDragStart(e){
		let x = e.drag.x;
		let y = e.drag.y;
		this.direction = Math.abs(x) >= Math.abs(y)? (x < 0? 'left' : 'right') : (y < 0? 'up' : 'down');
		let p = this.props;

		if (!p.onSwipe && !this.fnc[this.direction]) return super.onPointerUp(null, false);

		if (p._onDragStart) p._onDragStart(this);
	}


	onDragStop(e){
		let p = this.props;
		let d = this.direction;
		let x = e.speed.x;
		let y = e.speed.y;
		let l = p.speedLimit;
		// console.log('up', e.speed, d);

		if (d === 'left' && x > -l) return;
		if (d === 'right' && x < l) return;
		if (d === 'up' && y > -l) return;
		if (d === 'down' && y < l) return;

		if (p.onSwipe) p.onSwipe(this);

		if (this.fnc[this.direction]) this.fnc[this.direction](this);

		if (p._onDragStop) p._onDragStop(this);
	}
}
