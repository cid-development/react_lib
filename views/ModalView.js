/******************************************************************************
 * ModalView Component
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
import ReactDOM from 'react-dom';
import './ModalView.scss';
import { UIButton } from '../com/Toolbox';


//============================================================================= ModalView Component
export default class ModalView extends Component {
	constructor(props){
		super(props);

		this.state = {
			title		: props.title,
			buttons		: props.buttons,
			isOpen		: props.isOpen,

			children	: props.children || props.content,
			isMounted	: false,
		}

		this.isOpen = false;
		this.parentView = null;		//if this modal is parent of another modal
	}


	static defaultProps = {
		className		: 'modal-view',
		backClass		: 'modal-back',
		containerClass	: 'modal-container',
		headerClass		: 'modal-header',
		titleClass		: 'modal-title',
		bodyClass		: 'modal-body',
		footerClass		: 'modal-footer',

		buttons			: ['OK', 'Abbrechen'],
		autoDispose		: false,
		dragable		: false,
		autoClose		: true,		//if one of the buttons is clicked
		escToClose		: true,		//enable esc-key to close dialog
		isOpen			: false,

		onSubmit		: null,
		onOpen			: null,
		onClose			: null,
	}

	static currentView = null;
	static staticView = null;

	static open(props){
		if (!ModalView.staticView){
			var node = document.createElement('div');
			document.getElementById('root').appendChild(node);
			ModalView.staticView = ReactDOM.render(<ModalView {...props} isOpen={true} />, node );

		}else{
			ModalView.staticView.open(props);
		}
	}

	/*	---open/close methods:
		set isOpen from init
		update isOpen props
		set isOpen state
		call open method
	*/
	open(props){ this.setState({isOpen:true, ...props}) }

	close(){ this.setState({isOpen:false}) }

	setContent(){
		//
	}

	componentDidMount(){
		this.state.isMounted = true;
	}

	componentWillReceiveProps(p){
		this.setState({...p});
	}

	componentWillUnmount(){
		this.state.isMounted = false;
		if (this.state.isOpen){
			this.state.isOpen = false;
			this.onClose();
		}
	}

	onClick(e){
		if (this.props.onSubmit) this.props.onSubmit(e);
		if (this.props.autoClose) this.close();
	}

	onKey(e){
		if (e.keyCode === 27 && this === ModalView.currentView) this.close();
	}
	

	onOpen(){
		let p = this.props;
		this.parentView = ModalView.currentView;
		ModalView.currentView = this;

		if (p.escToClose){
			this.keybind = this.onKey.bind(this);
			document.addEventListener('keydown', this.keybind);
		}
		if (p.onOpen) p.onOpen(this);
	}


	onClose(){
		let p = this.props;
		ModalView.currentView = this.parentView;
		this.parentView = null;

		if (this.keybind){
			document.removeEventListener('keydown', this.keybind);
			this.keybind = null;
		}
		if (p.onClose) p.onClose(this);
	}


	render(){
		let p = this.props;
		let s = this.state;

		if (this.isOpen !== s.isOpen){	//switch open state
			this.isOpen = s.isOpen;
			if (s.isOpen) this.onOpen();
			else this.onClose();
		}

		return (
			<div
				className={p.className + (s.isOpen? ' open' : '')}
				id={p.id}
				style={p.style}
				>
				<div className={p.backClass}></div>

				<div className={p.containerClass}>
					<div className={p.headerClass}>
						<div className={p.titleClass}>{s.title}</div>
						<i className='material-icons modal-close' onClick={e => this.close()}>close</i>
					</div>

					{ s.children && <div className={p.bodyClass}>
						{s.children}
					</div> }

					<div className={p.footerClass}>
						{s.buttons.map((e, i) => <UIButton
							key={i}
							onClick={b => this.onClick(e)}
						>{e}</UIButton>)}
					</div>
				</div>
			</div>
		)
	}
}
