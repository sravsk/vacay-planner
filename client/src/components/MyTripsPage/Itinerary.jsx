import React from 'react';
import {Grid, Button, Modal} from 'semantic-ui-react';
import AddRestModal from './AddRestModal.jsx';

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRestModal: false,
      dateIndex: 0
    }
    this.addRestaurant = this.addRestaurant.bind(this);
  }

  addRestaurant (selectedTrip, index, date) { // reference day by index i
    console.log('In addRestaurant function', selectedTrip, index, date)
    this.setState({
      showRestModal: true,
      dateIndex: index
    })
  }

  hideModalAddRestaurant(restaurant, selectedTrip) {
    this.setState({
      showRestModal: false
    });
    // add restaurant to card
    console.log('newRest', restaurant, selectedTrip, this.state.dateIndex)
    // save restaurant in database in array corresponding to this day and trip
    var params = {
      restaurant: restaurant,
      tripId: selectedTrip,
      dateIndex: this.state.dateIndex
    };

  }

  render () {
    let toRender = [];
    let itinerary = this.props.itinerary;
    itinerary.forEach((day, index) => {
      var date = Object.keys(day)[0];
      const j = index;
      toRender[index] = (
        <div className="day" key={index}>
          {date}
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