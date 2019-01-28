/******************************************************************************
 * SlideView Component
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
import './SlideView.scss';
import SlideControl from '../utils/SlideControl';


//============================================================================= SlideView Component
export default class SlideView extends Component {
	constructor(props){
		super(props);

		this.state = {}
	}


	static defaultProps = {}


	componentDidMount(){
		this.control = new SlideControl(this.refs.slide, {
			onClick:e => console.log('click')
		});
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='slide-view' ref='slide' id={p.id} style={p.style}>
				SlideView
				<div className='slide-container' ref='container'>

				</div>
			</div>
		)
	}
}