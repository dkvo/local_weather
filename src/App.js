import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      temperature: '',
      description: '',
      iconUrl: ''
    };

    this.convertTemperature = this.convertTemperature.bind(this);
    this.convertToCelcius = this.convertToCelcius.bind(this);
    this.convertToFahrenheit = this.convertToFahrenheit.bind(this);
  }

  componentWillMount() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        if(!localStorage.getItem('coordinates') || localStorage.getItem('coordinates').latitude !== coordinates.latitude || localStorage.getItem('coordinates').longitude !== coordinates.longitude) {
          localStorage.setItem('coordinates', JSON.stringify(coordinates));
        }
      });
    }
    let position = JSON.parse(localStorage.getItem('coordinates'));
    axios.get(`https://fcc-weather-api.glitch.me/api/current?lat=${position.latitude}&lon=${position.longitude}`)
    .then((response) => {
      const data = response.data;
      this.setState({
        location: data.name + ', ' + data.sys.country,
        temperature: data.main.temp.toFixed(1),
        description: data.weather[0].main,
        iconUrl: data.weather[0].icon
      });
    })
    .catch(error => console.log(error));
  }

  convertTemperature(event){
    let target = event.target;
    if(target.innerHTML === 'F') {
      this.convertToCelcius();
      target.innerHTML = 'C';
    }
    else {
      this.convertToFahrenheit();
      target.innerHTML = 'F';
    }
  }
  
  convertToCelcius() {
    let temperature = this.state.temperature;
    temperature = (temperature - 32) * (5 / 9);
    this.setState({
      temperature: temperature.toFixed(1)
    });
  }
  convertToFahrenheit() {
    let temperature = this.state.temperature;
    temperature = temperature * (9 / 5) + 32;
    this.setState({
      temperature: temperature.toFixed(1)
    });
  }
  render() {
    const location = this.state.location;
    const temp = this.state.temperature;
    const description = this.state.description;
    const iconUrl = this.state.iconUrl;
    return (
      <div>
        <h2> Local Weather</h2>
        <div className="weather-meta">
          <p>{location}</p>
          <p>{temp} &deg;<span onClick={this.convertTemperature}>C</span></p>
          <p>{description}</p>
          <img src={iconUrl} alt={description}/>
        </div>
        <footer>Created by <a target="_blank" rel="noopener noreferrer" href="https://github.com/dkvo">Khoa Vo</a></footer>
      </div>
    );
  }
}

export default App;
