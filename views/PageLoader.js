/******************************************************************************
 * PageLoader Component
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

import React, { Component } from 'react';
import './PageLoader.scss';


export default class PageLoader extends Component {
	constructor(props){
		super(props);

		this.elements = {};		//lookup list for all elements
	}


	static defaultProps = {
		types	: [],
		events	: {},
		onSelect : null,
	}


	componentDidMount(){
	}


	onSelect(e){
		if (this.props.onSelect) this.props.onSelect(e.select, e);
	}


	getElement(e, i){
		if (e.active === false) return null;

		let p = this.props;

		if (e.onClick){			//replace onClick event handler
			e.onClick = p.events[e.onClick];

		}else if (e.select){
			e.onClick = () => this.onSelect(e);		//select event handler
		}

		if (e.children){
			let childs = [];
			e.children.map((c, j) => {
				let child = this.getElement(c, j);
				if (child) childs.push(child);
			});
			e.children = childs;
		}

		if (e.class){			//replace classNames
			e.className = e.class;
			delete e.class;
		}

		if (!e.type){			//shortcuts if no type is defined
			if (e.image) e.type = 'image';		//image type
			//...
		}

		let types = p.types;

		if (!types[e.type]){	
			if (e.src) return <img key={i} alt='' {...e} />				//simple image
			return <div key={i} {...e}>{e.children || e.text}</div>		//or simple div element

			// let e = document.createElement('...');
		}

		return React.cloneElement(types[e.type], {key:i, ...e});
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='page-loader' id={p.id}>
				{p.source && p.source.map((e, i) => {
					return this.getElement(e, i);
				})}
			</div>
		)
	}
}
