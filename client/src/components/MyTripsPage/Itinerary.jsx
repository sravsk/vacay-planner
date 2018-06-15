import React from 'react';
import {Grid, Button, Modal} from 'semantic-ui-react';
import axios from 'axios';
import AddRestModal from './AddRestModal.jsx';
import moment from 'moment';

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRestModal: false,
      dayIndex: 0,
      itinerary: []
    }
    this.addRestaurant = this.addRestaurant.bind(this);
  }

  addRestaurant (selectedTrip, index, date) { // reference day by index
    this.setState({
      showRestModal: true,
      dayIndex: index
    })
  }

  hideModalAddRestaurant(restaurant, selectedTrip) {
    this.setState({
      showRestModal: false
    });
    // add restaurant to card
    // console.log('newRest', restaurant, selectedTrip, this.state.dateIndex)
    // save restaurant in database in array corresponding to this day and trip
    var params = {
      restaurant: restaurant,
      tripId: selectedTrip,
      dayIndex: this.state.dayIndex
    };
    axios.post('/addRestToDay', params)
    .then(result => {
      this.setState({
        itinerary: result.data
      })
    })

  }

  render () {
    let toRender = [];
    let itinerary = [];
    if (this.state.itinerary.length == 0) {
      itinerary = this.props.itinerary;
    } else {
      itinerary = this.state.itinerary;
    }
    itinerary.forEach((day, index) => {
      var date = Object.keys(day)[0];
      var tripItems = day[date];
      // iterate over tripItems
      var tripDetails = tripItems.map((item, i) => {
        return (
          <span key={i}><br/><br/>{item}</span>
        );
      });
      toRender[index] = (
        <div className="day" key={index}>
          {date}
          {tripDetails}
          <br/><br/>
          <button onClick={() => this.addRestaurant(this.props.selectedTrip, index, date)}>Add restaurant</button><br/><br/>
          <AddRestModal show={this.state.showRestModal} handleClose={this.hideModalAddRestaurant.bind(this)} selectedTrip={this.props.selectedTrip} selectedRestaurants={this.props.restaurantsSelected} />
          <button>Add point of interest</button>
        </div>
      );
    })
    return (
      <div className="wrapper">
        {toRender}
      </div>
    );
  }
}

export default Itinerary;