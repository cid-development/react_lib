/******************************************************************************
 * UIView Component
 * version: 1.0.1, release: 07.09.2018
 * author: albert lang, albert@jumptonmorrow.com
 * ----------------------------------------------------------------------------
 * description:
 * 
 * dependencies: none
 * 
 * todos:
 * 
 * examples:
 * {id:0, label:'first value', value:0},
 * 
******************************************************************************/

import React, { Component } from 'react';
import './UIView.scss';
import {
	Counter,
	Timer,
	DATE,
	Time,
	DateTime,
	Options,
	DatePicker,
	UISwitch,
	UICheck,
	UIButton
} from '../com/Toolbox';
import DropDownList from '../../lib/com/DropDownList';
import UISelect from '../com/UISelect';

const dateFormat = require('dateformat');	//doc: https://github.com/felixge/node-dateformat


//============================================================================= UIView Component
export default class UIView extends Component {
	constructor(props){
		super(props);

		this.items = {};

		if (props.source){
			var source = [];
			if (Array.isArray(props.source)){
				source = props.source;
				props.source.map(s => {
					if (s && s.id !== undefined) this.items[s.id] = s
				});

			}else if (typeof(props.source) === 'object'){
				for (var i in props.source){
					let s = props.source[i];
					this.items[i] = s;
					if ('id' in s) this.items[s.id] = s;
					source.push(s);
				}
			}

			this.state = {source}
		}
	}


	static defaultProps = {
		source		: [],
		// itemClass	: 'ui-item',
		// labelClass	: 'ui-item-label',
	}


	componentDidMount(){
	}

	
	addItem(id, label, value){
		let t = typeof(id);

		let item = t === 'string'? {id, label, value} : t === 'object'? t : null;
		if (!item || this.items[item.id]) return;	//wrong item or same id already exists

		this.items[item.id] = item;
		this.state.source.push(item);
		this.setState({source:this.state.source});
	}


	update(id, value){
		let t = typeof(id);

		if (t === 'string'){
			if (!this.refs[id]) return;
			this.refs[id].setState({value});

		}else if (t === 'object'){
			for (var e in id){
				if (this.refs[e]) this.refs[e].setState({value:id[e]})
			}
		}
	}


	updateProps(id, props){
		if (!this.items[id]) return;
		Object.assign(this.items[id], props);
		this.setState({source:this.state.source});

		if ('value' in props) this.refs[id].setState({value:props.value});	//update also the item value if defined
	}


	render(){
		let p = this.props;
		let s = this.state;
		let c = 'ui-view' + (p.className? ' '+p.className : '');
		
		return (
			<div className={c} style={p.style} id={p.id}>
				{s.source.map((e, i) =>
					e && <UIItem ref={e.id} key={i} {...e} parent={this} data={e} />
				)}
			</div>
		)
	}
}


//============================================================================= UIItem
export class UIItem extends Component {
	constructor(props){
		super(props);
		this.state = {value	: props.value}
	}


	componentWillReceiveProps(p){
		this.setState({value:p.value});
	}


	componentDidMount(){
		this.label = this.refs.label;
		this.control = this.refs.control;

		if (this.props.type === 'group'){
			this.state.isOpen = true;
			this.state.height = this.refs.group.clientHeight;
		}
	}


	renderItem(p, c, r){
		let s = this.state;

		// if (p.inline){
		// 	return <div className={c} ref={r}>
		// 		{p.inline.map((e, i) => this.renderItem(e, c, null, i))}
		// 	</div>
		// }

		switch (p.type){
		// case 'group':
		// 	return <div className={'ui-group' + (p.open? ' open' : '')}>
		// 		<div className='ui-group-title'>
		// 		</div>
		// 		<div className='ui-group-content'>
		// 			{p.group.map((e, i) => <UIItem ref={e.id} key={i} {...e} parent={this} data={e} />)}
		// 		</div>
		// 	</div>
			
		case 'button':
			if (typeof(p.value) === 'string'){
				return <div className={c} ref={r}>
					<div className='ui-item-button'
						onClick={e => {p.onClick && p.onClick(p.value)}}>{p.value}</div>
				</div>
			}else if (Array.isArray(p.value)){
				return <div className={c} ref={r}>
					{p.value.map((e, i) =>
						<div key={i} className='ui-item-button'
							onClick={b => {p.onClick && p.onClick(e)}}>{e}</div>
					)}
				</div>
			}
			return;

		case 'toggle'	: return;
		case 'list'		: return;

		case 'select'	:
			// return <DropDownList value={p.value} source={p.source} />
			return <div className={c} ref={r}>
				<UISelect value={p.value} source={p.source} />
			</div>

		case 'file':
			return <input className={c + ' ui-input'} ref={r} type='file'
				value={s.value} onChange={e => {
					p.data.value = e.target.value;
					this.setState({value:e.target.value});
				}} />
		
		case 'folder':
			return;

		case 'input':
			return <input className={c + ' ui-input'} ref={r} type='text'
				value={s.value} onChange={e => {
					p.data.value = e.target.value;
					this.setState({value:e.target.value});
				}} />

		case 'inputbutton':
			return <div className='ui-item-inline' ref={r}>
				<input className={c + ' ui-input'} type='text'
					value={s.value} onChange={e => {
					p.data.value = e.target.value;
					this.setState({value:e.target.value});
				}} />
				<UIButton />
			</div>
	
		case 'option':
			return <Options className={c + ' ui-options'} ref={r} value={s.value} source={p.source} onChange={e => {
				p.data.value = e;
				this.setState({value:e});
			}} />

		case 'date':
			return <div className={c} ref={r}>
				<DatePicker className='ui-date-picker' {...p} date={s.value} onChange={e => {
					// p.data.value = dateFormat(e, 'dd.MM.yyyy');
					p.data.value = e;
					this.setState({value:e});
				}} />
			</div>

		case 'check':
			return <div className={c} ref={r}>
				{/* <input className='ui-item-check' type='checkbox' checked={s.value} onChange={e => {
					p.data.value = e.target.value;
					this.setState({value:e.target.value});
				}} />
				{p.label} */}
				<UICheck label={p.title} checked={s.value} onChange={e => {
					p.data.value = e;
					this.setState({value:e});
				}} />
			</div>

		case 'switch':
			return <div className={c} ref={r}>
				<UISwitch label={p.title} checked={s.value} onChange={e => {
					p.data.value = e;
					this.setState({value:e});
				}} />
			</div>
	
		case 'counter':
			return <Counter className={c} ref={r} startValue={p.value || 10} {...p} />

		case 'timer':
			return <Timer className={c} ref={r} startValue={p.value || 0} {...p}/>

		case 'datetime':
			return <DateTime className={c} ref={r} {...p} />

		case 'list':
			break;

		default:
			if (Array.isArray(s.value)){
				return <div className={c} ref={r}>
					{Array.from(s.value).map((e, i) => 
						<div key={i} className='ui-item-col'>{e}</div>
					)}
				</div>
				
			}else if ('min' in p && 'max' in p){
				let width = String(100 * (s.value - p.min) / (p.max - p.min)) + '%';
				return <div className={c + ' ui-range'} ref={r}>
					<div className='ui-item-range-bar' style={{width}}></div>
					{p.showLimits !== false && <div className='ui-item-range-min' >{p.min}</div>}
					{p.showLimits !== false && <div className='ui-item-range-max' >{p.max}</div>}
					<div className='ui-item-range-value' >{s.value}</div>
				</div>

			}else if (p.value){
				return <div className={c + ' ui-value'} ref={r}>{p.value}</div>;
			}
		}
	}


	renderGroup(s, p){
		return <div className='ui-group' style={p.style} id={p.id}>
			<div ref='label' className='ui-group-label' onClick={e => {
				let h = !s.isOpen;
				this.refs.group.style.height = h? s.height + 'px' : 0;
				// this.refs.group.style.height = h? '100%' : 0;
				this.setState({isOpen:h});
			}}>{p.label}</div>

			<div className='ui-group-content' ref='group' >
				{p.group.map((e, i) => <UIItem ref={e.id} key={i} {...e} parent={this} data={e} />)}
			</div>
		</div>
	}


	render(){
		let p = this.props;
		let s = this.state;
		let par = p.parent.props;

		if (p.type === 'group') return this.renderGroup(s, p);

		// if (p.inline) return this.renderInline(s, p);

		let c = 'ui-item' + (par.itemClass? ' '+par.itemClass : '');
		let l = 'ui-item-label' + (par.labelClass? ' '+par.labelClass : '');

		return (
			<div className={c} style={p.style} id={p.id}>

				{p.label != undefined && <div ref='label' className={l}>{p.label}</div>}

				{p.inline?
					<div className='ui-item-inline'>
						{p.inline.map((e, i) => <UIItem ref={e.id} key={i} {...e} parent={this} data={e} />)}
						{/* {p.inline.map((e, i) => this.renderItem(e, 'ui-item-control', 'control'))} */}
					</div>
					: this.renderItem(p, 'ui-item-control', 'control')	
				}
				{/* {this.renderItem(p, 'ui-item-control', 'control')} */}
				{/* {p.inline && this.renderItem(p.inline[0])} */}
			</div>
		)
	}
}
