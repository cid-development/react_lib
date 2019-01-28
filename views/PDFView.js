/******************************************************************************
 * PDFView Component
 * version: 1.0.2, release: 07.09.2018
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
import './PDFView.scss';
import { pdfjs, Document, Outline, Page } from 'react-pdf';	//https://github.com/wojtekmaj/react-pdf

const fs = window.require('fs');

console.log('pdfjs-lib version:', pdfjs.version);
pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/'+pdfjs.version+'/pdf.worker.js';



//============================================================================= PDFView Component
export default class PDFView extends Component {
	constructor(props){
		super(props);

		this.state = {
			file			: props.pdf,
			pages		: null,
			loaded		: 0,
			total		: 0,
			error		: null,
			numPages	: 0,
		}
	}


	static defaultProps = {
		file				: '',
		// width			: 200,
		height			: 800,
	}


	componentDidMount(){

	}


	async getPageImage(file, page, width=0, height=0, callback){
		pdfjs.getDocument(file).then(pdf => {
			console.log('doc complete!', pdf);

			pdf.getPage(page).then(page => {
				console.log('page complete!', page);

				var viewport = page.getViewport(1);
				if (width || height){
					let s = width? width / viewport.width : height / viewport.height;
					viewport = page.getViewport(s);
				}
				console.log(viewport);

				let canvas = this.refs.canvas;
				// let canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');

				context.imageSmoothingEnabled = true;
				context.imageSmoothingQuality = 'high';

				canvas.height = viewport.height;
				canvas.width = viewport.width;

				page.render({canvasContext:context, viewport}).then(e => {
					console.log('render complete!');
					// this.refs.img.src = canvas.toDataURL();
					if (callback) callback(canvas);
					// if (callback) callback(canvas.toDataURL());
				});
			})
		});
	}


	onDocumentLoadSuccess(pdf){
		console.log('document loaded completelly!');
		let m = pdf.getMetadata().then(e => {
			console.log('metadata:', e);
		})
		this.setState({ pdf, numPages:pdf.numPages, currentPage:1 });
	}


	onRenderComplete(page){
		console.log('render complete', page.getViewport({scale:1}));
	}


	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='pdf-view' id={p.id} style={p.style}>
				<canvas ref='canvas' width={200} height={200} />

				<img ref='img' alt='' />

				<Document
					file={s.file}
					className='pdf-doc'
					onLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
					// renderMode='svg'
					renderMode='canvas'
					>

					{/* ---bookmarks */}
					{/* {s.pdf && <Outline pdf={s.pdf} />} */}

					{s.numPages &&
						<Page
							className='pdf-page'
							pageNumber={s.currentPage}
							// width={p.width}
							height={p.height}
							renderTextLayer={false}
							renderAnnotationLayer={false}
							onRenderSuccess={this.onRenderComplete.bind(this)}
						/>
					}

					<div className='pdf-index'>
						{Array.from(new Array(s.numPages), (e, i) =>
							<Page
								key={i}
								className='pdf-thumb'
								pageNumber={i + 1}
								height={80}
								renderTextLayer={false}
								renderAnnotationLayer={false}
								onRenderSuccess={e => {
									// console.log('complete', e);
								}}
							/>
						)}
					</div>
				</Document>
			</div>
		)
	}
}
