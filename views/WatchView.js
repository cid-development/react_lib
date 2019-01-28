/******************************************************************************
 * WatchView Component
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
import './WatchView.scss';


//============================================================================= WatchView Component
export default class WatchView extends Component {
	constructor(props){
		super(props);

		this.state = {
			source	: props.source
		}
	}


	static defaultProps = {
		source	: []
	}


	componentDidMount(){
	}


	addItem(id, label, value){
		if (this.refs[id]) return;		//same id alredy exists
		this.state.source.push({id, label, value});
		this.setState({source:this.state.source});
	}


	update(id, value){
		if (!this.refs[id]) return;
		this.refs[id].setState({value});
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='watch-view' style={p.style}>
				{s.source.map((e, i) =>
					<WatchItem ref={e.id} key={i} label={e.label} value={e.value} />
				)}
			</div>
		)
	}
}


//============================================================================= WatchItem
export class WatchItem extends Component {
	constructor(props){
		super(props);
		this.state = {value	: props.value}
	}

	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='watch-item' style={p.style}>
				<div className='watch-item-label'>{p.label}</div>
				<div className='watch-item-value'>{s.value}</div>
			</div>
		)
	}
}
