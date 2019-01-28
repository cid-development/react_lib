/******************************************************************************
 * UISelect Component
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
import './UISelect.scss';


//============================================================================= UISelect Component
export default class UISelect extends Component {
	constructor(props){
		super(props);

		let p = this.props;
		let value = (p.startIndex >= 0 && p.source.length > p.startIndex )? p.source[p.startIndex] : p.value;

		this.state = {
			isOpen		: false,
			source		: p.source,
			value,
			selectedIndex	: p.startIndex,
		}
	}


	static defaultProps = {
		source		: [],
		value		: '',
		startIndex	: 0,
		labelField	: 'label',

		onSelect	: null,

		className	: 'ui-select',
		buttonClass	: 'ui-select-button',
		listClass	: 'ui-select-list',
		itemClass	: 'ui-select-item',
	}


	componentDidMount(){
		this.onClickBind = this.onClick.bind(this);
		document.addEventListener('click', this.onClickBind, false);
	}


	componentWillUnmount(){
		document.removeEventListener('click', this.onClickBind, false);
	}


	onClick(e){
		let s = this.state;
		if (e.target === this.refs.button){
			this.setState({isOpen:!s.isOpen});

		}else if (this.refs.list.contains(e.target)){
			this.onSelect(Number(e.target.id));

		}else if (s.isOpen) this.setState({isOpen:false});
	}


	onSelect(id){
		let value = this.state.source[id];
		this.setState({value, selectedIndex:id, isOpen:false});
		if (this.props.onSelect) this.props.onSelect(this);
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className={p.className} id={p.id} style={p.style}>
				<div className={p.buttonClass} ref='button'
				>{typeof(s.value) === 'string'? s.value : s.value[p.labelField]}</div>

				<div className={p.listClass + (s.isOpen? ' open' : '')} ref='list'
					>
					{s.source.map((e, i) =>
						<div className={p.itemClass + (i === s.selectedIndex? ' selected' : '')}
							key={i} id={i}
						>{typeof(e) === 'string'? e : e[p.labelField]}</div>)}
				</div>
			</div>
		)
	}
}