import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import FoodAndEventsPage from './components/FoodAndEventsPage/FoodAndEventsPage.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import SignUpPage from './components/SignUpPage/SignUpPage.jsx';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import MyTripsPage from './components/MyTripsPage/MyTripsPage.jsx';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

const Router = BrowserRouter;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loc: '',
      latLng: {},
      startDate: new Date(),
      endDate: new Date()
    };
    this.loginUser = this.loginUser.bind(this);
    this.signUpUser = this.signUpUser.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.handleLocSelect = this.handleLocSelect.bind(this)
    this.handleStartDayChange = this.handleStartDayChange.bind(this);
    this.handleEndDayChange = this.handleEndDayChange.bind(this);
  }

  loginUser(email, password, history) {
    $.ajax({
      url: '/login',
      method: 'POST',
      data: {email: email, password: password},
      dataType: 'json',
      success: (data) => {
        this.setState({ user: data })
        history.push('/')
      },
      error: (err) => {
        alert(err.responseText);
      }
    })
  }

  signUpUser(email, password, history) {
    //console.log('email: ', email);
    //console.log('password: ', password);

    $.ajax({
      url: '/signup',
      method: 'POST',
      data: {email: email, password: password},
      dataType: 'json',
      success: (data) => {
        this.setState({ user: data })
        history.push('/')
      },
      error: (err) => {
        alert(err.responseText);
      }
    })
  }

  handleLocChange(e) {
    this.setState({
      loc: e
    })
  }

  handleStartDayChange(day) {
    this.setState({ startDate: day });
  }

  handleEndDayChange(day) {
    this.setState({ endDate: day });
  }

  handleLocSelect(location) {
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          loc: location,
          latLng: latLng
        })
      })
      .catch(error => console.error('Error', error))
  }

  render() {
    return (
      <Router>
        <div className='container'>
          <Route exact path='/' render={(props) => {
            return (
              <LandingPage
                handleStartDayChange={this.handleStartDayChange}
                handleEndDayChange={this.handleEndDayChange}
                handleLogout={this.handleLogout}
                handleLocChange={this.handleLocChange}
                handleLocSelect={this.handleLocSelect}
                user={this.state.user}
                loc={this.state.loc}
                {...props}
              />
            )} }/>
          <Route path='/login' render={(props) => {
            return (
              <LoginPage loginUser={this.loginUser} {...props} />
            )} }/>
          <Route path='/signup' render={(props) => {
            return (
              <SignUpPage signUpUser={this.signUpUser} {...props} />
            )} }/>
          <Route path='/foodandevents' render={(props) => {
            return (
              <FoodAndEventsPage
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                user={this.state.user}
                inputLocation={this.state.loc}
                latLng={this.state.latLng}
                {...props}
              />
            )} }/>
          <Route path='/mytrips' render={(props) => {
            return (
              <MyTripsPage user={this.state.user} {...props} />
            )} } />
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
