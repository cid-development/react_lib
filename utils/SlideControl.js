//DEPRECATED!//

/******************************************************************************
 * SlideControl Component
 * version: 1.0.1, release: 07.05.2018
 * author: albert lang, albert@jumptonmorrow.com
 * ----------------------------------------------------------------------------
 * description:
 * 
 * dependencies: none
 * 
 * todos:
 * 
******************************************************************************/

// import PointerControl from './pointerControl';
import DragControl from './DragControl';

const name = 'SlideControl';
const version = '1.0.1';


export default class SlideControl extends DragControl {
	constructor(target, props){

		super(target, {...SlideControl.defaultProps, ...props});

		// this.minDuration = 1000;
		// this.minSwipeSpeed	= 0.1;
		// this.timeMultiplier = 0;
		// this.onSwipeStart = null;
		// this.onSwipeComplete = null;
		// this.onUpdate = null;

	}


	//------------------------------------------------------------------------- onPointerDown
	// onPointerDown(e){
	// 	if (this.isDown) return;	//one pointer is already touched (to prevent multiple pointer events)

	// 	super.onPointerDown(e);
	// }


	//------------------------------------------------------------------------- onPointUp
	onStartDrag(){
		let sl = this.slide;
		if (sl.x.swipe || sl.y.swipe){
			let slOn = Math.abs(sl.x.drag) >= Math.abs(sl.y.drag)? sl.x : sl.y;
			let slOff = (slOn.dir === 'x')? sl.y : sl.x;

			slOn.isSwiping = true;

			slOff._enabled = slOff.enabled;		//cache enabled state
			slOff.enabled = false;				//turn of while swipeing
			if (this.onSwipeStart) this.onSwipeStart(slOn);
		}

		super.onStartDrag();
	}


	//------------------------------------------------------------------------- onEnterUp
	//single pointer up event
	// onEnterUp(e){
	// 	super.onEnterUp(e);
	// }


	//------------------------------------------------------------------------- startSlide
	startSlide(sl, e){
		sl.duration	= this._slideDuration;
		sl.ease		= this.easing;
		sl.lastPos	= sl.pos;

		var o = this.isOut(sl);

		if (o === -1) sl.target = sl.min;		//move back from outside left

		else if (o === 1) sl.target = sl.max;	//move back from outside right

		else {
			// sl.target = (sl.speed > this.minSwipeSpeed)? sl.max
				// : (sl.speed < -this.minSwipeSpeed)? -sl.min
				// : Math.round(sl.lastPos / sl.grid) * sl.grid;
			sl.target = parseInt(sl.lastPos / sl.grid) * sl.grid;
			if (sl.speed > this.minSwipeSpeed || (sl.lastPos - sl.target) > sl.grid / 2) sl.target += sl.grid;
		}

		sl.size = sl.target - sl.lastPos;		//slide size

		sl.startTime = e;
		sl.progress = 0;
		sl.isSliding = true;

		// super.startSlide(sl, e);
	}

}
