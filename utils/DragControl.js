/******************************************************************************
 * DragControl Component
 * version: 1.0.9, release: 30.12.2018
 * author: albert lang, albert@jumptonmorrow.com
 * ----------------------------------------------------------------------------
 * description:
 * 
 * dependencies: none
 * 
 * todos:
 * 
******************************************************************************/


//---slow time simulation
// var time = 0;
// const requestAnimationFrame = (callback) => {
// 	setTimeout(callback, 200, time += 16);
// }


export default class DragControl{
	constructor(target, props){

		this.target = target || document;
		this.pixelSize		= 1;

		// this.props = Object.assign({}, DragControl.defaultProps);	//copy defaultProps
		// Object.assign(this.props, props);							//append props
		this.props = {...DragControl.defaultProps, ...props};			//copy defaultProps

		this.init();
	}


	static defaultProps = {
		dragLimit		: 0,
		speedDynamic	: 0.2,
		calcSpeed		: false,

		targetExcludes	: [],

		onDown			: null,
		onUp			: null,
		onClick			: null,
		onDragStart		: null,
		onDragStop		: null,
		onMove			: null,
		onUpdate		: null,

		dragEnabled		: true,
		// dragRightEnabled: true,
		// dragLeftEnabled	: true,
		// mode			: 'xy',		//null | xy | x | y | -x | +x | -y | +y
	}


	//------------------------------------------------------------------------- init
	init(){
		this.speed	= {x:0, y:0};
		this.drag	= {x:0, y:0};
		this.move	= {x:0, y:0};
		this.start	= {x:0, y:0};
		this.pos	= {x:0, y:0};
		// this.pixelSize = window.devicePixelRatio;
		// this.pixelSize = 1;
		this.isDraging = false;

		this.downBind = this.onPointerDown.bind(this);
		this.moveBind = this.onPointerMove.bind(this);
		this.upBind = this.onPointerUp.bind(this);
		this.enterMoveBind = this.onEnterMove.bind(this);

		this.target.addEventListener('mousedown', this.downBind);	//-> onPointerDown
		this.target.addEventListener('touchstart', this.downBind);	//-> onPointerDown
	}


	static isDown = false;		//singleton state for multiple slideViews

	//------------------------------------------------------------------------- onPointerDown
	onPointerDown(e){
		if (e.target.id && this.props.targetExcludes[e.target.id] === false ) return;
		if (this.isDown || DragControl.isDown) return;	//one pointer is already touched (to prevent multiple pointer events)
		if (!this.props.dragEnabled) return;	//wait till last sliding is complete

// e.preventDefault();

		this.speed.x = this.speed.y = 0;
		this.move.x = this.move.y = 0;
		this.drag.x = this.drag.y = 0;

		this.isDown = DragControl.isDown = true;		//public down flag
		
		this.isDraging = false;

		if (e.type === 'touchstart'){
			this.touchDown = true;
			this.start.x = e.touches[0].clientX;
			this.start.y = e.touches[0].clientY;
			document.addEventListener('touchmove', this.moveBind);
			document.addEventListener('touchcancel', this.upBind);
			document.addEventListener('touchend', this.upBind);

		}else{
			this.start.x = e.clientX;
			this.start.y = e.clientY;
			document.addEventListener('mousemove', this.moveBind);	//-> onPointerMove
			document.addEventListener('mouseup', this.upBind);			//-> onPointerUp
		}

		if (this.props.onDown) this.props.onDown(this);
	}


	//------------------------------------------------------------------------- onPointerMove
	onPointerMove(e){
		var px, py;
		if (this.touchDown){
			px = e.touches[0].clientX;
			py = e.touches[0].clientY;
		}else{
			px = e.clientX;
			py = e.clientY;
		}
		let dx = px - this.start.x;
		let dy = py - this.start.y;

		this.move.x = dx - this.drag.x;
		this.move.y = dy - this.drag.y;
		if (this.move.x === 0 && this.move.y === 0) return;

		e.preventDefault();	//?

		this.drag.x = dx;
		this.drag.y = dy;

		let p = this.props;

		if (!this.isDraging){					//check if drag limits reached
			if (p.dragLimit > 0
				&& Math.abs(this.drag.x) < p.dragLimit
				&& Math.abs(this.drag.y) < p.dragLimit) return;

			this.isDraging = true;				//start moving now
			this.start.x = px;
			this.start.y = py;

			if (p.onDragStart) p.onDragStart(this);

			this.drag.x = this.drag.y = 0;		//reset dragging
			this._lastTime = 0;
			if (p.calcSpeed) requestAnimationFrame(this.enterMoveBind);		//start enter frame loop (onEnterMove)

		}else if (p.onMove) p.onMove(this);		//still moving
	}


	//------------------------------------------------------------------------- onEnterMove
	onEnterMove(e){
		if (!this._lastTime){
			requestAnimationFrame(this.enterMoveBind);
			return this._lastTime = e;
		}
		this._ticks = e - this._lastTime;				//number of milliseconds since last frame
		this._lastTime = e;

		if (this.move.x === 0){
			this.speed.x *= (1 - this.props.speedDynamic);		//move speed in pixel / millisecond
		}else{
			this.speed.x += ((this.move.x / this._ticks) - this.speed.x) * this.props.speedDynamic;		//move speed in pixel / millisecond
		}
		if (this.move.y === 0){
			this.speed.y *= (1 - this.props.speedDynamic);		//move speed in pixel / millisecond
		}else{
			this.speed.y += ((this.move.y / this._ticks) - this.speed.y) * this.props.speedDynamic;		//move speed in pixel / millisecond
		}

		// if (this.props.onUpdate && (this.move.x !== 0 || this.move.y !== 0)) this.props.onUpdate(this);
		if (this.props.onUpdate) this.props.onUpdate(this);
		this.move.x = this.move.y = 0;

		if (this.isDown) requestAnimationFrame(this.enterMoveBind);		//still down
	}


	//------------------------------------------------------------------------- onPointerUp
	onPointerUp(e, event=true){
		// e.preventDefault();

		if (this.touchDown){
			document.removeEventListener('touchmove', this.moveBind);
			document.removeEventListener('touchcancel', this.upBind);
			document.removeEventListener('touchend', this.upBind);
			this.touchDown = false;
		}else{
			document.removeEventListener('mousemove', this.moveBind);
			document.removeEventListener('mouseup', this.upBind);
		}

		if (event){
			if (this.props.onUp) this.props.onUp(this);
			if (this.isDraging && this.props.onDragStop) this.props.onDragStop(this);
			if (!this.isDraging && this.props.onClick) this.props.onClick(this);	//single click
		}

		this.isDown = this.isDraging = DragControl.isDown = false;
	}


	// *** Static-Methods *****************************************************

	static speed = {x:0, y:0};
	static downBind = DragControl.onPointerDown;

	static init(target){
		let dc = DragControl;
		// this.speed	= {x:0, y:0};
		// this.drag	= {x:0, y:0};
		// this.move	= {x:0, y:0};
		// this.start	= {x:0, y:0};
		// this.pos	= {x:0, y:0};
		// // this.pixelSize = window.devicePixelRatio;
		// // this.pixelSize = 1;
		// this.isDraging = false;

		// this.downBind = this.onPointerDown.bind(this);
		// this.moveBind = this.onPointerMove.bind(this);
		// this.upBind = this.onPointerUp.bind(this);
		// this.enterMoveBind = this.onEnterMove.bind(this);

		// this.target.addEventListener('mousedown', this.downBind);	//-> onPointerDown
		// this.target.addEventListener('touchstart', this.downBind);	//-> onPointerDown

		target.addEventListener('mousedown', dc.downBind);	//-> onPointerDown
		target.addEventListener('touchstart', dc.downBind);	//-> onPointerDown
	}

	static onPointerDown(){
		//
	}

}
