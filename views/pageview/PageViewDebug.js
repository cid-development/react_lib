/******************************************************************************
 * PageViewDebug Component
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
import './PageViewDebug.scss';


//============================================================================= PageViewDebug Component
export default class PageViewDebug extends Component {
	constructor(props){
		super(props);

		this.state = {
			selectedIndex	: 0
		}
	}


	static defaultProps = {
		loop	: true,
		view	: null, 		//pageView reference
	}


	componentDidMount(){
	}


	onClick(e){
		if (!e.target.id) return;
		let v = this.props.view;

		switch(e.target.id){
			case 'first': return v.firstPage();
			case 'prev': return v.prevPage();
			case 'next': return v.nextPage();
			case 'last': return v.lastPage();
		}
		console.log(e.target.id);
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='pageview-debug' id={p.id} style={p.style}>
				<div className='pv-debug-panel' onClick={this.onClick.bind(this)}>
					<i id='first' className='material-icons'>first_page</i>
					<i id='prev' className='material-icons'>chevron_left</i>
					<div>{s.selectedIndex}</div>
					<i id='next' className='material-icons'>chevron_right</i>
					<i id='last' className='material-icons'>last_page</i>
				</div>
			</div>
		)
	}
}