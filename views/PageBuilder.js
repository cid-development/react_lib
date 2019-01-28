/******************************************************************************
 * PageBuilder Component
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
import './PageBuilder.scss';
const fs = window.require('fs'); 


export default class PageBuilder extends Component {
	constructor(props){
		super(props);

		this.elements = [];		//lookup list for all elements

		this.state = {
			source 		: props.source,
			// sourceData	: props.source,
			styles 		: props.styles,
			isMounted	: false,
			isLoaded	: false,
		}

		this.sourceData = null;
		this.templateData = null;
		// this.loadStyles(props.styles);
	}


	static defaultProps = {
		types	: [],
		events	: {},
		source  : null,
		// sourceData : null,
		styles  : null,

		sourceNode	: 'app',
		templateNode : 'templates'
	}


	componentDidMount(){
		// console.log('###---mount');
		this.state.isMounted = true;
	}


	async loadSource(source, clear=true){
		console.log('###---load source', source, '...');
		this.state.isLoaded = false;
		this.sourceData = null;
		this.source = source;
		this.elements = [];

		var data;
		if (typeof(source) == 'string'){
			if (clear) this.setState({isLoaded:false, source})

			data = await( await fetch(source)
				.then(res => res.json())
				.catch(err => {return err})
			)
			if (data instanceof Error){
				console.log('---page-builder source error!', data);
				return this.setState({isLoaded:false, source:null})
			}
	
		}else{
			// data = {...source};		//create copy from original source
			data = source;		//create copy from original source
		}

		let cdata = data.data;
		if (cdata){
			console.log('preload content data ...');
			for (var i in cdata){
				let d = cdata[i];
				if (typeof(d) === 'string' && d.substr(0, 2) === './'){
					let json = await ( await fetch(d) ).json();
					if (json){
						cdata[i] = json;
					}
					// await this.loadContentData();
				}
			}
			console.log('ok');
		}

		console.log('---page-builder source loaded:', data);
		this.sourceData = data;
		// this.templateData = data[this.props.templateNode];
		// this.types = {...this.props.types, ...data[this.props.templateNode]}
// let app = this.sourceData[this.props.sourceNode];
// app.map((e, i) => {
// 	this.elements.push(this.getElement(e, i));
// })

		this.setState({isLoaded:true, source});
		// this.state.isLoaded = true;
	}


	async loadContentData(){
		console.log('wait  3...')
		return await new Promise(r => setTimeout(r, 3000));  //wait 5 seconds
	}


	onSelect(e){
		if (this.props.onSelect) this.props.onSelect(e);
	}


	onClick(e){
		let evt = typeof(e) === 'string'? e : Array.isArray(e)? e[0] : null;
		if (!this.props.events[evt]) return;
		this.props.events[evt](e);
	}


	//------------------------------------------------------------------------- getElement
	getElement(e, i, param, replaceId){
		if ('active' in e && !e.active) return null;

		let p = this.props;

		if (typeof(e) === 'string') e = {"type":"text", "text":e};
		else e = {...e};		//immutable

		if (replaceId) e.id = replaceId;

		// this.replaceData(e, 'nodes', 'children');	//replace nodes
		// this.replaceData(e, 'childs', 'children');	//replace childs
		this.replaceData(e, 'class', 'className');		//replace class
		this.replaceData(e, 'image', 'src');			//replace image

		if (e.click){			//replace onClick event handler
			e.onClick = () => this.onClick(e.click);
		}else if (e.select){
			e.onClick = () => this.onSelect(e.select);		//select event handler
		}

		this.parseData(e);

		var childs;
		if (e.childs){		//---parse childs
			childs = [];
			e.childs.map((c, j) => {
				let child = this.getElement(c, j, param);
				if (child) childs.push(child);
			});
			delete e.childs;
		}

		var type = e.type;
		if (!type){				//shortcuts if no type is defined
			if (e.image || e.src) type = 'image';		//image type
			if (e.text !== undefined) type = 'text';
			//...
		}

		if (param) this.parseProps(e, param);		//---replace parameters

		let templates = this.sourceData[p.templateNode];
		let temp = p.types[type] || templates[type];
		var el;

		if (temp){
			if (e.repeat){
				if (typeof(e.repeat) === 'string') return;

				return e.repeat.map((el, ii) => {
					let pr = (typeof(el) === 'object')? {...el} : {value:el};

					if (temp.$$typeof){		//the template is a react element
						return React.cloneElement(temp, {key:ii, ...e, ...pr});
					}else{					//the template is a object
						return this.getElement(temp, ii, pr);
					}
				})
			}else{
				if (temp.$$typeof){
					el = React.cloneElement(temp, {key:i, ...e}, childs);
				}else{
					el = this.getElement(temp, i, e.param, e.id);
				}
			}
		}
		else if (e.src) el = <img key={i} alt='' {...e} />

		else if (e.icon) el = <i key={i} className='material-icons' {...e} >{e.icon}</i>

		else {		//get div wrapper
			let ch = childs || e.text || e[0];
			el = React.cloneElement(<Div />, {key:i, ...e}, ch);
		}

		if (e.id !== undefined) this.elements[e.id] = el;

		return el;
	}


	parseData(e){
		let data = this.sourceData.data;
		if (!data) return;

		for (var k in e){		//parse all element attributes and replace the data placeholder
			if (typeof(e[k]) !== 'string') continue;

			if (e[k].substr(0, 2) === '#d'){
				let d = e[k].split('.');
				if (data[d[1]] !== undefined) e[k] = data[d[1]];
			}
		}

		if (e.param) this.parseData(e.param);	//parse also the param element
	}


	parseProps(e, param){
		for (var k in e){
			if (typeof(e[k]) !== 'string') continue;

			if (e[k].substr(0, 2) === '#p'){
				let t = e[k].split('.');
				if (param[t[1]] !== undefined) e[k] = param[t[1]];
			}
		}
	}


	replaceData(data, from, to, override=true){
		if (data[from] === undefined) return;
		if (data[to] !== undefined && !override) return;
		data[to] = data[from];
		delete data[from];
	}


	componentWillReceiveProps(p, s){
		// console.log('###---receifeProps', s, p);
		if (this.state.source != p.source) this.state.source = p.source;
		if (this.state.styles != p.styles) this.state.styles = p.styles;
	}

	
	componentWillUpdate(p, s){
		// console.log('###---willupdate', s, p);
		if (this.source != s.source){
			this.loadSource(s.source, false);
		}
	}


	reload(){
		this.loadSource(this.source);
	}


	componentDidUpdate(){
		// console.log('###-updated!', this.refs);
	}


	render(){
		let p = this.props;
		let s = this.state;
		let app = this.sourceData && this.sourceData[p.sourceNode];

		return (
			<div className='page-builder' id={p.id}>
				<div className='page-builder-container'>
					{/* {this.elements && this.elements} */}
					{/* {s.isLoaded && this.elements.map((e, i) => {
						return e;
					})} */}
					{s.isLoaded && app && app.map((e, i) => {
						// console.log('###---render!', app);
						return this.getElement(e, i);
					})}
				</div>
				{s.isLoaded && s.styles &&
					<link rel='stylesheet' type='text/css' href={s.styles} />
					// <link rel='stylesheet' type='text/css' href='app-1.css' />
				}
			</div>
		)
	}
}


//============================================================================= Div Wrapper Class
const Div = (p) => {
	let childs = Array.isArray(p.children)? p.children : [p.children]

	return(
		<div id={p.id} className={p.className} >
			{childs.map((c, i) => {
				return c.$$typeof? React.cloneElement(c, {parent:p}) : c;
			})}
		</div>
	)
}
