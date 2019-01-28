/******************************************************************************
 * PageView Component
 * version: 1.0.3, release: 18.12.2018
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
import './PageView.scss';
import PageViewDebug from './PageViewDebug';
// import SwipeControl from '../utils/SwipeControl';


//============================================================================= PageView Component
export default class PageView extends Component {
	constructor(props){
		super(props);

		this.source = props.children || props.source || [];
		if (this.source && !Array.isArray(this.source)) this.source = [this.source];	//convert single source to array

		this.numPages = this.source.length;
		this.pageList = [];		//list of all ready mounted pages
		this.pages = props.parentPage? props.parentPage.props.view.pages : {};		//page lookup list incl all subPageViews
		this.elements = [];
		this.history = [];

		this.state = {
			isMounted		: false,
			overview		: false,
			selectedIndex	: -1,
			selectedPage	: null,
			elements		: this.elements,		//source elements
			onInit			: null,
		}
	}


	static defaultProps = {
		className		: 'pageview',
		containerClass	: 'pageview-container',
		pageClass		: 'page',
		startIndex		: 0,
		autoMount		: false,
		autoUnmount		: false,
		parentPage		: null,			//if this is a sup-PageView fom a parent Page
		onPageSelect	: null,
		debug			: false,
		// useControl		: false,	//if using swipeControl
		// swipeBackEnabled	:false,
	}


	componentDidMount(){
		// this.state.isMounted = true;
		this.setState({isMounted:true});

		this.source.map((e, i) => {
			let v = this.props.startIndex === i;
			if (v || this.props.autoMount || (e.props && e.props.autoMount)){
				this.addPage({index:i, selected:v})				//-> initPage

			}else if (e.props && e.props.id){
				this.pages[e.props.id] = {source:e, view:this, index:i};	//cache source as placeholder to page lookup list
			}
		})

		// if (this.props.useControl) this.control = new SwipeControl(this.refs.pageView);
	}

	/*
		---source array examples:
		{id:'mypage', source:MyPage}
		{id:'mypage', source:<MyPage />}
		<Page id='mypage' source={MyPage} autoMount />
		<Page id='mypage' source={<MyPage />} />
		<Page id='mypage'><MyPage /></Page>
		<MyPage id='mypage' />

		---pages object format:
		{source, view, index, selected}
	*/
	addPage(param, replace=false){
		if (!param) return;

		if (param.index && this.pageList[param.index]){	//page with this index is already added
			return this.selectPage(param.index);
		}

		let id = param.id || param.title;

		if (!replace && id && this.pages[id]){			//page with this id already added
			return this.selectPage(id);
		}

		var src = this.source[param.index];
		if (!src){
			if (param.source && id){
				var i = param.index = this.source.length;
				param.selected = true;
				param.view = this;

				this.source.push(param);	//add new source
				this.numPages = this.source.length;

				this.pages[id] = param;		//add page to lookup list
				src = param;

			}else return;
		}else var i = param.index;

		let s = this.state;

		if (src.source){					//create new page from source
			src = !src.source.$$typeof?
				React.createElement(src.source, src)
				: React.cloneElement(src.source, src);

		}else if (!src.$$typeof) src = React.createElement(src);

		let props = {
			id: src.props && src.props.id,
			key: i,
			index: i,
			view: this,
			...param
		}

		if (src.type === Page){
			var child = src.props.source || src.props.children[0] || src.props.children;
			if (child && !child.$$typeof) child = React.createElement(child);
			s.elements[i] = React.cloneElement(src, props, child);
		}else{
			s.elements[i] = <Page {...props} >{src}</Page>
		}

		this.setState({elements:this.elements});

		if (param.selected) this.selectPage(i);

		return param;
	}


	removePage(){
		//
	}


	initPage(p){
		let id = p.props.index;
		console.log('---init page:', this.props.id, '/', id, p.props.id, p.props.selected);

		this.pageList[id] = p;
		this.pages[id] = p;
		if (p.props.id !== undefined) this.pages[p.props.id] = p;

		if (p.props.selected) this.selectPage(id);
		// this.state.selectedPage = p;
		// this.state.selectedIndex = id;
		// if (p.props.selected) this.setState({selectedPage:p, selectedIndex:id});
		// if (this.props.onPageSelect) this.props.onPageSelect(this);
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className={p.className} id={p.id} style={p.style}>
				<div className={p.containerClass}>
					{s.elements}
				</div>
				{p.debug && <PageViewDebug ref='debug' view={this} />}
			</div>
		)
	}


	// ---common methods-------------------------------------------------------

	selectPage(id, recursiv=false){
		let s = this.state;

		if (typeof(id) === 'string'){		//select page from id
			if (!this.pages[id]) return;	//element id not exists

			var page = this.pages[id];
			// id = page.index;
			var p, v, i;

			if (page.source){				//this page is not mounted and only cached as placeholder in the lookup list
				page.view.addPage({index:page.index, selected:true});	//-> initPage -> selectPage
				v = page.view;

			}else{
				v = page.props.view;
				i = page.props.index;
				v.selectPage(i);			//select this page
			}
			// else p.constructor.name === 'Page'

			if (recursiv){
				while(v.props.parentPage){		//select parent pages recursive
					p = v.props.parentPage;
					v = p.props.view;
					i = p.props.index;
					v.selectPage(i);
				}
			}
			return page;
		}
		
		if (s.selectedIndex === id) return;				//still selected
		if (id < 0 || id > this.numPages-1) return;		//wrong id

		// console.log('---select page', id);
		if (s.selectedPage){				//unselect current selected page
			s.selectedPage.setState({isSelected:false});

			//unmount:
			// let i = s.selectedPage.props.index;
			// this.elements.splice(i, 1);
			// this.pageList.splice(i, 1);
			// this.setState({elements:this.elements});
		}

		if (this.pageList[id]){				//page already mounted
			let page = this.pageList[id];
			this.state.selectedPage = page;
			this.state.selectedIndex = id;

			page.setState({isSelected:true});
			this.setState({selectedIndex:id, selectedPage:page});

			console.log('---select page', id, page.props.id);
			if (this.props.onPageSelect) this.props.onPageSelect(this);
			if (this.refs.debug) this.refs.debug.setState({selectedIndex:id});
			
			return page;

		}else if (!this.elements[id]){							//page is still not added
			this.addPage({index:id, selected:true}, true);		//replace placeholder -> initPage
		}
	}


	gotoPage(id){
		this.selectPage(id);
	}

	nextPage(){
		if (this.state.selectedIndex < this.numPages-1) this.selectPage(this.state.selectedIndex+1);
	}

	prevPage(){
		if (this.state.selectedIndex > 0) this.selectPage(this.state.selectedIndex-1);
	}

	firstPage(){
		this.selectPage(0);
	}

	lastPage(){
		this.selectPage(this.numPages-1);
	}

	goBack(){
		if (this.history.length) this.selectPage(this.history[this.history.length-1]);
	}

	goHome(){
		this.selectPage(this.props.startIndex);
	}
}



//============================================================================= Page Component
export class Page extends Component {
	constructor(props){
		super(props);

		this.state = {
			isMounted	: false,
			isSelected	: props.selected
		}
	}


	static defaultProps = {
		index		: -1,
		className	: 'page'
	}


	componentDidMount(){
		// console.log('---mount page', this.props.index, this.props.id);
		// this.state.isMounted = true;
		this.setState({isMounted:true});
		this.props.view.initPage(this);
	}


	componentWillUnmount(){
		console.log('---unmount page', this.props.index, this.props.id);
	}


	render(){
		this.selected = this.state.isSelected;
		
		let p = this.props;
		let s = this.state;
		let c = p.className + (s.isSelected? ' selected' : '');
		let child = (p.children && p.children[0]) || p.children;
		let element = child && React.cloneElement(child, {page:this, view:p.view});

		return (
			<div className={c} style={p.style} ref='pageView'>
				{element}
			</div>
		)
	}
}
