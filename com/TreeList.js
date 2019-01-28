/******************************************************************************
 * TreeList Component
 * version: 1.0.3, release: 24.09.2018
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
import './TreeList.scss';

const name = 'TreeList';
const version = '1.0.3';


export default class TreeList extends React.Component {
	constructor(props) {
		console.log('---init', name, '| version', version);
		super(props);

		this.selectedItem = null;		//the last selected item
		this.items = {};				//item lookup list for direct access

		this.state = {
			isMounted	: false,
		}
	}
	
	static defaultProps = {
// selected	: 'pageview-demo',
		startId		: null,
		selectLast	: true,

		source		: [],
		multiOpen	: true,
		onClick		: null,
		onSelect	: null,
		onOpen		: null,
		onClose		: null,
		className	: 'treelist',
		itemClass	: 'treelist-item',
		buttonClass	: 'treelist-button',
		nodeClass	: 'treelist-node',
		labelField	: 'title',
		type		: 'root',		//item-tiype: root | node | item
	}

	expandAll(){}

	closeAll(){}

	addItem(){}

	removeItem(){}

	onItemSelect(e){
		let ep = e.props;
		let p = this.props;
	
		if (e.hasNodes){	//its a node with sub-items
			let open = !e.state.isOpen;
			e.setState({ isOpen: open });	//switch node

			if (open){
				let o = ep.parent.openNode;
				if (o && !p.multiOpen && o !== e) o.setState({ isOpen: false });	//close last node
				ep.parent.openNode = e;
				if (p.onOpen) p.onOpen(ep.data);

			}else if (p.onClose) p.onClose(ep.data);
	
		}else{				//ites a item
			let s = this.selectedItem;
			if (s && s.props.id === e.props.id) return;

			if (s) s.setState({ isSelected: false });	//unselect last item
	
			this.selectedItem = e;
			if (p.selectLast){
				localStorage.setItem('tree-list_' + (p.id || ''), ep.id);
			}

			e.setState({ isSelected: true });			//select new item

			if (p.onSelect) p.onSelect(ep.data);

			//check recursive if all tree nodes are open
			while(e.props.parent && e.props.parent.props.type === 'node'){
				e = e.props.parent;
				if (!e.state.isOpen) this.onItemSelect(e);
			}
		}
		if (p.onClick) p.onClick(ep.data);
	}


	initItem(e){
		this.items[e.props.id] = e;		//add item to lookup list
	}
	

	componentDidMount(){
		this.state.isMounted = true;
		let p = this.props;

		let start = p.selectLast?
			localStorage.getItem('tree-list_' + (p.id || '')):
			p.startId;

		if (start && this.items[start]) this.onItemSelect(this.items[start]);
	}

	
	render(){
		let p = this.props;
		
        return(
			<div
				id={p.id}
				style={p.style}
				className={p.className}
				>
        		{p.source.map((item, i) => 
					<TreeItem
						key={i}
						id={item.id || item[p.labelField]}
						level={0}
						data={item}
						parent={this}
						root={this}
						type={item.nodes && item.nodes.length? 'node' : 'item'}
					/>
                )}
            </div>
        )
    }
}


class TreeItem extends React.Component {
	constructor(props){
		super(props);

		this.openNode = null;
		this.hasNodes = false;

		let n = props.data.nodes;
		if (n && n.length){
			this.hasNodes = true;
			if (props.data.isOpen) this.state.isOpen = true;
			// this.state.isOpen = props.data.isOpen;
			// if (this.state.isOpen) props.parent.openNode = this;

// }else{
// this.state.isSelected = props.data.isSelected || props.root.props.selected === props.data.id;
		}

		// console.log('###-data', props.data, (props.data.id, props.root.));
	}

    static defaultProps = {
		level		: 0,
		parent		: null,
    }

	state = {
        isSelected	: false,
        isOpen		: false,
	}


	componentDidMount(){
		if (this.props.type === 'item') this.props.root.initItem(this);
// if (this.state.isSelected) this.props.root.onItemSelect(this);
	}


	render(){
		let s = this.state;
		let p = this.props;

		let d = p.data;
		let r = p.root;
		let l = p.level + 1;
		let c = r.props.itemClass + (s.isSelected? ' selected' : '');
		let n = r.props.nodeClass + (s.isOpen? ' open' : '');
		let t = d[r.props.labelField] || d.title || d.label || d.name;
		
		return (
			<div className={c}>
				<div
					className={r.props.buttonClass}
					style={{paddingLeft: l + 'rem'}}
					onClick={() => r.onItemSelect(this)}
					>
					{t}
				</div>

				{/* {s.isOpen && */}
				{d.nodes && d.nodes.length &&
					<div className={n}>
						{d.nodes.map( (item, i) =>
							<TreeItem
								key={i}
								id={item.id || item[r.props.labelField]}
								level={l}
								data={item}
								parent={this}
								root={r}
								type={item.nodes && item.nodes.length? 'node' : 'item'}
							/>
						)}
					</div>
				}
			</div>
		)
	}
}
