/******************************************************************************
 * ButtonBar Component
 * version: 1.0.2, release: 24.09.2018
 * author:  albert lang, albert@jumptonmorrow.com
 * ----------------------------------------------------------------------------
 * description:
 * 
 * dependencies: none
 * 
 * todos:
 * 
******************************************************************************/

import React from "react";
import './ButtonBar.scss';
import { UIButton } from "./Toolbox";

const name = 'ButtonBar';
const version = '1.0.3';


export default class ButtonBar extends React.Component {
	constructor(props) {
		super(props);
		console.log('---init', name, '| version', version);

		this.state = {
			selectedItem	: null
		}		
	}
	
	static defaultProps = {
		source		: [],
		onClick		: null,
		onSelect	: null,
		className	: 'buttonbar',
		itemClass	: 'buttonbar-item',
		buttonClass	: 'buttonbar-button',
		labelField	: 'title',
		toggle		: false,
	}


	onItemSelect(e){
		let p = e.props;
		let r = this.props;
		let s = this.state;

		if (r.toggle && !e.state.isSelected){
			if (s.selectedItem) s.selectedItem.setState({isSelected:false});
			e.setState({isSelected:true});
			this.setState({selectedItem:e});
			if (r.onSelect) r.onSelect(p.data);
		}

		if (r.onClick) r.onClick(p.data, e);
	}


	onClick(e, t){
		if (this.props.onClick) this.props.onClick(e, t);
	}


	render(){
		let p = this.props;
		
        return(
			<div id={p.id} style={p.style} className={p.className}>
				{p.source.map((item, i) => 
					<UIButton
						key={i}
						label={item[p.labelField] || item.title || item.label || item.name || item}
						onClick={e => this.onClick(item, e.target)}
					/>
					// <ButtonItem
					// 	key={i}
					// 	level={0}
					// 	data={item}
					// 	parent={this}
					// />
                )}
            </div>
        )
    }
}


class ButtonItem extends React.Component {
	constructor(props){
		super(props);

		let d = props.data;
		let r = props.parent;

		this.state = {
			isSelected	: false,
			label		: d[r.props.labelField] || d.title || d.label || d.name || d
		}
	}

    static defaultProps = {
    }

	set label(val){ this.setState({label:val}) }

	get label(){ return this.state.label }

	componentDidMount(){
		if (this.state.isSelected) this.props.root.onItemSelect(this);
	}


	render(){
		let s = this.state;
		let p = this.props;

		let d = p.data;
		let r = p.parent;
		let c = r.props.itemClass + (s.isSelected? ' selected' : '');
		// let t = d[r.props.labelField] || d.title || d.label || d.name || d;
		let t = s.label;
		
		return (
			<div className={c} onClick={() => r.onItemSelect(this)}>
				{t}
			</div>
		)
	}
}
