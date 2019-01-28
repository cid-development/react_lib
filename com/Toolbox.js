import React from 'react';
import DatePicker_ from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Toolbox.scss';

const dateFormat = require('dateformat');	//doc: https://github.com/felixge/node-dateformat



//============================================================================= Range
export const Range = (e) => <div></div>


//============================================================================= Button
export const UIButton = (e) => <div
		className={e.className || 'ui-button'}
		onClick={e.onClick}
	>{e.label || e.children}</div>


//============================================================================= UICheck
export class UICheck extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			checked:props.checked
		}
	}

	static defautlProps = {
		checked:false
	}

	componentDidMount(){
	}

	componentWillReceiveProps(p){
		this.setState({checked:p.checked})
	}

	onChange(e){
		let checked = !this.state.checked;
		this.setState({checked})
		if (this.props.onChange) this.props.onChange(checked);
	}

	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='ui-control' onClick={e => this.onChange(e)}>
				<div className={'ui-check' + (s.checked? ' checked' : '')}
					style={p.style}
					id={p.id}
					>
					<i className='material-icons'>{s.checked? 'check' : ''}</i>
				</div>
				{p.label && <div className='ui-label'>{p.label}</div>}
			</div>
		)
	}
}


//============================================================================= UISwitch
export class UISwitch extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			checked:props.checked
		}
	}

	static defautlProps = {
		checked:false
	}

	componentDidMount(){
	}

	componentWillReceiveProps(p){
		this.setState({checked:p.checked})
	}

	onChange(e){
		let checked = !this.state.checked;
		this.setState({checked})
		if (this.props.onChange) this.props.onChange(checked);
	}

	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className='ui-control' onClick={e => this.onChange(e)}>
				<div className={'ui-switch' + (s.checked? ' checked' : '')}
					style={p.style}
					id={p.id}
					>
					<div className='ui-switch-button'/>
				</div>
				{p.label && <div className='ui-label'>{p.label}</div>}
			</div>
		)
	}
}


//============================================================================= DatePicker
export class DatePicker extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			date: props.date || new Date()
		}
	}

	static defaultProps = {
		clearButton		: true,
		dateFormat		: 'dd.MM.yyyy',
	}

	componentWillReceiveProps(p){
		this.setState({date:p.date})
	}

	onChange(e){
		this.setState({date:e});
		if (this.props.onChange) this.props.onChange(e);
	}

	render(){
		let p = this.props;
		let s = this.state;

		return (
			<DatePicker_
				className={p.className}
				isClearable={p.clearButton}
				dateFormat={p.dateFormat}
				selected={s.date}
				onChange={e => this.onChange(e)}
			/>
		)
	}
}



//============================================================================= Options
export class Options extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			value: props.value
		}
	}

	static defaultProps = {
	}

	componentWillReceiveProps(p){
		this.setState({value:p.value})
	}

	componentDidMount(){
	}

	componentWillUnmount(){
	}

	onChange(e){
		this.setState({value:e});
		if (this.props.onChange) this.props.onChange(e);
	}

	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div className={p.className}>
				{p.source.map((e, i) =>
					<div key={i} onClick={d => this.onChange(e)}>
						<input type='radio' onChange={d => this.onChange(e)} checked={e === s.value}></input>
						{e}
					</div>
				)}
			</div>
		)
	}
}


//============================================================================= Counter
export class Counter extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			value: props.startValue
		}
	}

	static defaultProps = {
		autoStart	: false,
		startValue	: 10,
		mode		: 'number', 	//number | time
	}

	start(){
		// console.log('start counter');
		clearInterval(this.interval);

		this.interval = setInterval(e => {
			let value = this.state.value - 1;
			this.setState({value});

			if (value <= 0){
				clearInterval(this.interval);
				if (this.props.onComplete) this.props.onComplete(this);
			}
		}, 1000);
	}

	stop(){
		// console.log('stop counter');
		clearInterval(this.interval);
	}

	componentDidMount(){
		if (this.props.autoStart) this.start();
	}

	componentWillUnmount(){
		this.stop();
	}

	getTimeValue(v){
		let s = v % 60;
		let m = Math.floor(v / 60) % 60;
		let h = m >= 60? (Math.floor(h / 60) + ':') : '';
		return h + m + ':' + (s < 10? '0'+s : s);
	}

	render(){
		let v = this.props.mode === 'number'? this.state.value
			: this.getTimeValue(this.state.value);

		return <div className={this.props.className}>{v}</div>
	}
}


//============================================================================= Timer
export class Timer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			value: props.startValue
		}
	}

	static defaultProps = {
		autoStart	: false,
		startValue	: 10,
	}

	start(){
		// console.log('start timer');
		clearInterval(this.interval);

		this.interval = setInterval(e => {
			let value = this.state.value + 1;
			this.setState({value});
		}, 1000);
	}

	stop(){
		// console.log('stop timer');
		clearInterval(this.interval);
	}

	componentDidMount(){
		if (this.props.autoStart) this.start();
	}

	componentWillUnmount(){
		this.stop();
	}

	getTimeValue(v){
		let s = v % 60;
		let m = Math.floor(v / 60);
		return m + ':' + (s < 10? '0'+s : s);
	}

	render(){
		let v = this.getTimeValue(this.state.value);

		return <div className={this.props.className}>{v}</div>
	}
}


//============================================================================= DateTime
export class DateTime extends React.Component{
	constructor(props){
		super(props);
	}

	static defaultProps = {
		format		: 'dd.mm.yyyy HH:MM:ss',
		interval	: 1000,
		autoUpdate	: true,
	}

	componentDidMount(){
		if (this.props.autoUpdate && this.props.interval){
			this.interval = setInterval(e => {
				this.refs.time.innerText = dateFormat(new Date(), this.props.format);
			}, this.props.interval);
		}
		
		this.refs.time.innerText = dateFormat(new Date(), this.props.format);
	}

	componentWillUnmount(){
		clearInterval(this.interval);
	}

	render(){
		return <div className={this.props.className} ref='time'></div>
	}
}


/* --- component template

//============================================================================= Select
export class Select extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			value: props.value
		}
	}

	static defaultProps = {
	}

	render(){
		let p = this.props;
		let s = this.state;

		return (
			<div></div>
		)
	}
}
*/
