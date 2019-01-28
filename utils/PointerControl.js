/******************************************************************************
 * PointerControl Component
 * version: 1.0.8, release: 16.11.2018
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


export default class PointerControl{
	constructor(target, props){

		this.target = target || document;
		this.pixelSize		= 1;

		this.props = Object.assign({}, PointerControl.defaultProps);	//copy defaultProps
		Object.assign(this.props, props);							//appand props

		this.init();
	}


	static defaultProps = {
		dragLimit		: 20,
		speedDynamic	: 0.8,

		targetExcludes	: [],

		onDown			: null,
		onUp			: null,
		onClick			: null,
		onStartDrag		: null,
		onMove			: null,
		onUpdate		: null,

		dragEnabled		: true,
		dragRightEnabled	: true,
		dragLeftEnabled	: true,
	}


	//------------------------------------------------------------------------- init
	init(){
		this.speed = 0;
		this.drag = {x:0, y:0};
		this.pixelSize = window.devicePixelRatio;
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
		if (this.isDown || PointerControl.isDown) return;	//one pointer is already touched (to prevent multiple pointer events)
		if (!this.props.dragEnabled) return;	//wait till last sliding is complete

// e.preventDefault();

		this.speed = this.move = this.drag.x = this.drag.y = 0;

		this.isDown = PointerControl.isDown = true;
		
		this.isDraging = false;

		if (e.type === 'touchstart'){
			this.touchDown = true;
			this.touchPos = {x:e.touches[0].clientX, y:e.touches[0].clientY};
			document.addEventListener('touchmove', this.moveBind);
			document.addEventListener('touchcancel', this.upBind);
			document.addEventListener('touchend', this.upBind);
		}else{
			this.target.addEventListener('mousemove', this.moveBind);	//-> onPointerMove
			document.addEventListener('mouseup', this.upBind);			//-> onPointerUp
		}

		if (this.props.onDown) this.props.onDown(this);
	}


	//------------------------------------------------------------------------- onPointerMove
	onPointerMove(e){
		var mx, my;
		if (this.touchDown){
			let x0 = e.touches[0].clientX;
			let y0 = e.touches[0].clientY;
			mx = (x0 - this.touchPos.x) / this.pixelSize;
			my = (y0 - this.touchPos.y) / this.pixelSize;
			this.touchPos.x = x0;
			this.touchPos.y = y0;
		}else{
			if (!e.movementX) return;		//no movement
			mx = e.movementX / this.pixelSize;
			my = e.movementY / this.pixelSize;
		}

if (mx < 0 && !this.props.dragRightEnabled) mx = 0;
if (mx > 0 && !this.props.dragLeftEnabled) mx = 0;

		e.preventDefault();	//?
		
		let p = this.props;

		if (!this.isDraging){
this.drag.y += my;
if (p.dragLimit > 0 && Math.abs(this.drag.y) > p.dragLimit){
	// console.log('dragOff');
	return this.onPointerUp(e, false);
}

			this.drag.x += mx;
			if (p.dragLimit > 0 && Math.abs(this.drag.x) < p.dragLimit) return;

			this.isDraging = true;		//start moving now
			this.drag.x = 0;
			this.move = 0;
			if (p.onStartDrag) p.onStartDrag(this);
			requestAnimationFrame(this.enterMoveBind);		//start enter frame loop (onEnterMove)

		}else{							//still moving

			this.move = mx;
			this.drag.x += this.move;

			if (p.onMove) p.onMove(this);
		}
	}

	
	//------------------------------------------------------------------------- onEnterMove
	onEnterMove(e){
		this._ticks = e - this._lastTime;				//number of milliseconds since last frame
		this._lastTime = e;

		if (this.move !== 0){
			this.speed = this.move / this._ticks;		//move speed in pixel / millisecond
			this.move = 0;
			if (this.props.onUpdate) this.props.onUpdate(this);
			
		}else{
			this.speed *= this.props.speedDynamic;
		}

		if (this.isDown) requestAnimationFrame(this.enterMoveBind);		//still down
	}


	//------------------------------------------------------------------------- onPointerUp
	onPointerUp(e, event=true){
		// e.preventDefault();

		// console.log('up');
		this.isDown = PointerControl.isDown = false;

		if (this.touchDown){
			document.removeEventListener('touchmove', this.moveBind);
			document.removeEventListener('touchcancel', this.upBind);
			document.removeEventListener('touchend', this.upBind);
			this.touchDown = false;
		}else{
			this.target.removeEventListener('mousemove', this.moveBind);
			document.removeEventListener('mouseup', this.upBind);
		}

		if (event && this.props.onUp) this.props.onUp(this);

		if (event && !this.isDraging && this.props.onClick) this.props.onClick(this);	//single click

		this.isDraging = false;
	}
}

