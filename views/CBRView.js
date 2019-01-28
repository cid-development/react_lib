/******************************************************************************
 * CBRView Component
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
import './CBRView.scss';

// const decompress = require('decompress');
// const rarfile = require('rarfile');

// import sevenBin from '7zip-bin';
// import { extractFull } from 'node-7z';

const fs = window.require("fs");
// var unrar = window.require("node-unrar-js");

// const Zip = window.require('node-7z-forall'); // Name the class as you want!
// var Zip = window.require('machinepack-zip');

const ua = window.require('all-unpacker');


//============================================================================= CBRView Component
export default class CBRView extends Component {
	constructor(props){
		super(props);
		this.state = {}
	}


	static defaultProps = {}


	componentDidMount(){
	}


	getList(){
		let file = 'H:/DEV/ELECTRON/pdf-exporter/cbr/Carlsen.cbr';
		console.log('read', file, '...');
		// let file = 'H:/DEV/ELECTRON/pdf-exporter/import/example_rar_5.rar';
		let dest = 'H:/DEV/ELECTRON/pdf-exporter/export'

		ua.list(file, {}, (err, files, text) => {
			console.log(err, files, text);
		});
	}


	extract(indexes=[0]){
		let file = 'H:/DEV/ELECTRON/pdf-exporter/cbr/Carlsen.cbr';
		console.log('extract', file, '...');
		// let file = 'H:/DEV/ELECTRON/pdf-exporter/import/example_rar_5.rar';
		let dest = 'H:/DEV/ELECTRON/pdf-exporter/export'

		ua.unpack(file, {
				targetDir:dest,
				forceOverwrite:true,
				indexes,
				quiet:false,			//dont loging to console
			}, (err, files, text) => {
			console.log(err, files, text);
		})
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className={p.className} id='CBRView' style={p.style}>
				CBRVIEW
			</div>
		)
	}
}