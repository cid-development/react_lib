/******************************************************************************
 * GridView Component
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
import './GridView.scss';


//============================================================================= GridView Component
export default class GridView extends Component {
	constructor(props){
		super(props);

		let columns = props.columns;
		if (!columns.length && props.source.length){		//parse columns from first source keys
			let e = props.source[0];
			for (var i in e) columns.push(i);
		}
		console.log('###', columns);

		this.state = {
			source : props.source,
			columns,
		}
	}


	static defaultProps = {
		showHeadline: true,
		source		: [],
		columns		: [],
	}


	componentDidMount(){
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='grid-view' id={p.id} style={p.style}>
				<div className='grid-headline'>
				</div>

				<div className='grid-list'>
					{s.source.map((e, i) => <GridItem view={this} key={i} source={e} />)}				
				</div>
			</div>
		)
	}
}



//============================================================================= GridItem Component
class GridItem extends React.Component {
	constructor(props){
		super(props)
		this.state = {}
	}

	static defaultProps = {
		className : 'grid-item'
	}

	render(){
		let p = this.props;
		let s = this.state;
		let c = p.view.props.columns;

		return(
			<div className={p.className}>
				{c.map((e, i) =>
					<div key={i} className={'grid-cell col-'+i}>
						{p.source[e]}
					</div>
				)}
			</div>
		)
	}
}
