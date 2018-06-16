import React from 'react';
import axios from 'axios';
import { Select, Button, Dropdown, Grid } from 'semantic-ui-react'

class AddRestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: '',
      latLng: {
        lat: 0,
        lng: 0
      }
    }
  }

  handleChange(e, value) {
   this.setState({
   restaurant : value.value
     })
  }

  render() {
    const  value  = this.state.restaurant;
    let restaurants = this.props.selectedRestaurants;
    var newSelection;
    let optionItems = restaurants.map((restaurant) => {
      return (
           newSelection = {
            text : restaurant.name + '; ' + restaurant.display_address,
            value : restaurant.name + '; ' + restaurant.display_address
        }
      );
    });
    return (
      <div>
        <h4>Select Restaurant to add to Calendar</h4>
        <Dropdown
          placeholder="Select a Restaurant"
          onChange={this.handleChange.bind(this)}
          options={optionItems}
          value={value}
          selection/>
        <br/><br/>
        <Button onClick={(restaurant) => this.props.addRest(this.state.restaurant)}>Submit</Button>
      </div>
    );
  }
}

export default AddRestModal;