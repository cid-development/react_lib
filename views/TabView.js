/******************************************************************************
 * TabView Component
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
import './TabView.scss';
import ButtonBar from '../com/ButtonBar';


//============================================================================= TabView Component
export default class TabView extends Component {
	constructor(props){
		super(props);

		this.state = {
			labels 			: props.labels,
			selectedIndex	: props.startIndex,
		}
	}


	static defaultProps = {
		labels 			: [],
		startIndex		: 0,
		onSelect		: null,
	}


	componentDidMount(){
	}


	onSelect(e){
		this.setState({selectedIndex:e});
		if (this.props.onSelect) this.props.onSelect(this);
	}


	render(){
		let p = this.props;
		let s = this.state;

		let childs = Array.isArray(p.children)? p.children : [p.children];

		return (
			<div className='tab-view' id={p.id} style={p.style}>
				<div className='tab-view-buttonbar'>
					{s.labels.map((e, i) => <div key={i}
						className={'tab-view-button' + (s.selectedIndex === i? ' selected' : '')}
						onClick={e => this.onSelect(i)}
						>{e}</div>)}
				</div>
				<div className='tab-view-container'>
					{childs.map((e, i) => <div key={i}
						className={'tab-view-tab' + (s.selectedIndex === i? ' selected' : '')}
						>{e}</div>)}
				</div>
				{/* <div className='tab-view-container'>
					{s.source.map((e, i) => <div key={i}
						className={'tab-view-tab' + (s.selectedIndex === i? ' selected' : '')}>
						{e.content}
					</div>)}
				</div> */}
				{/* {p.children} */}
			</div>
		)
	}
}