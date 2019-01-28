/******************************************************************************
 * MasonryView Component
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
import './MasonryView.scss';


//============================================================================= MasonryView Component
export default class MasonryView extends Component {
	constructor(props){
		super(props);
		this.state = {}
	}


	static defaultProps = {}


	componentDidMount(){
		
	}

// https://codepen.io/artursden/pen/dRWeBw
/*
https://picsum.photos/200/300?random
https://placeimg.com/640/480/any		//people
http://lorempixel.com/400/200/people/1/
*/

	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='masonry-view' id={p.id} style={p.style}>

				<div className="container">
				<div className="row masonry-grid">
				<div className="col-md-6 col-lg-4 masonry-column">
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x450/fff"/></a>
					</div>
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x250/3F51B5/fff"/></a>
					</div>
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x550/3F51B5/fff"/></a>
					</div>
				</div>
				<div className="col-md-6 col-lg-4 masonry-column">
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x150/3F51B5/fff"/></a>
					</div>
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x250/3F51B5/fff"/></a>
					</div>
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x650/3F51B5/fff"/></a>
					</div>
				</div>
				<div className="col-md-6 col-lg-4 masonry-column">
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x550/3F51B5/fff"/></a>
					</div>
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x450/3F51B5/fff"/></a>
					</div>
					<div>
					<a className="thumbnail"><img src="http://via.placeholder.com/400x450/3F51B5/fff"/></a>
					</div>
				</div>
				</div>
				</div>

			</div>
		)
	}
}