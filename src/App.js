// esline-disable-next-line
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

	const initState = {
      city: "",
	  country: "",
	  temp: "",
	  humidity: "",
	  description: "",
	  message: ""
    };

class ShowWeather extends React.Component {
	constructor(props){
		super(props)
	}
	render(){
		if (this.props.message == '' && this.props.city == "") {
			return '';
		}
		if(this.props.message != ''){
			return <h1>{this.props.message}</h1>
		} else {
			return (
				<div>
					<h1>{this.props.city} - {this.props.country}</h1>
					<h3>Temp: {this.props.temp}&deg;C</h3>
					<h3>Humidity: {this.props.humidity}</h3>
					<h3>Description: {this.props.description}</h3>
				</div>
			)
		}
	}
}
	
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = initState;
  }

	handleSubmit = (e) => {
		this.setState(initState);
		e.preventDefault();		
		let userInput = this.refs.newText.value;
		let url = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&APPID=64cb336129744e730f15442f985de387&units=metric`;

		fetch(url)
		.then( response => response.json())
		.then( (data) => {
			if(data.cod == 404){
				this.setState({message: "Can't find such city: " + userInput})
			} else {
				this.setState({
				city: data.name,
				country: data.sys.country,
				temp: data.main.temp,
				humidity: data.main.humidity,
				description: data.weather[0].main + ' - ' + data.weather[0].description
			})
			
			}this.refs.newText.value = '';
		})
		.catch( (e) => {
			document.querySelector("#showWeather").innerHTML = `<h1>can't find such city: ${userInput}</h1>`;
			this.refs.newText.value = '';
		})
	}
	
	autoLocate = () => {
		this.setState(initState);
		if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition( (position) => {					
					let lat = position.coords.latitude;
					let lon = position.coords.longitude;
					let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=64cb336129744e730f15442f985de387&units=metric`;
					fetch(url)
					.then( response => response.json())
					.then( (data) => this.setState({
						city: data.name,
						country: data.sys.country,
						temp: data.main.temp,
						humidity: data.main.humidity,
						description: data.weather[0].main + ' - ' + data.weather[0].description
					}));
					}
				);
			}
	}
 
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Kenny's React Weather App</h1>
        </header>
        <p className="App-intro">
          Input city's name and hit submit
        </p>
		
		<form>
			<input ref="newText" type="text" placeholder="name of city"/>
			<button className="btn btn-danger btn-xs" onClick={this.handleSubmit}>SUBMIT</button>
		</form>
		
		<p className="checkCurrent">Or you can simply hit the button below to check current weather of your current location
		,<br /> but you've to allow the machine to get your current location</p>
		
		<button className="btn btn-danger" onClick={this.autoLocate}>CHECK WEATHER OF WHERE YOU ARE</button>
		
		<div id="showWeather">
			<ShowWeather 
				message={this.state.message} 
				city={this.state.city} 
				country={this.state.country}
				temp={this.state.temp}
				humidity={this.state.humidity}
				description={this.state.description} />
		</div>
      </div>	
    );
  }
}

export default App;