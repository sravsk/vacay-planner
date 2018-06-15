import React from 'react';
import axios from 'axios';
import { Select, Button, Dropdown } from 'semantic-ui-react'

class AddRestModal extends React.Component {
  constructor(props) {
    super(props);
    let rest = this.props.selectedRestaurants[0];
    this.state = {
      restaurant: `${rest.name}, ${rest.display_address}`,
      dayIndex: this.props.dateIndex,
      // latLng: {
      //   lat: rest.restLat,
      //   lng: rest.restLong
      // }
    }
  }

  onChange(event, { value} ) {
    this.setState({
      [event.target.name]: event.target.value
    });
    //this.setState({ value })
  }

  render() {
    let showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    let restaurants = this.props.selectedRestaurants;
    let optionItems = restaurants.map((restaurant) => {
      return (
        <option key={restaurant.id}>{restaurant.name}, {restaurant.display_address}</option>
      );
    });
    return (

        <div className="modal-main">
        <br/>
        <h4>Select Restaurant</h4>
        <Dropdown
          placeholder="Select a Restaurant"
          onChange={this.onChange.bind(this)}
          options={optionItems}
          value={this.state.restaurant}
          selection/>
        <br/><br/>
          <Button className="btn" onClick={ (restaurant) => {return this.props.handleClose(this.state.restaurant, this.props.selectedTrip)} }>Submit</Button>
        </div>

    );
  }
}

export default AddRestModal;



  // <div className={showHideClassName}>
  //     in modal component
  //       <div className="modal-main">
  //       <br/>
  //       <h4>Add restaurant: </h4><select name='restaurant' value={this.state.restaurant} onChange={this.onChange.bind(this)}>
  //         {optionItems}
  //       </select><br/><br/>
  //         <button className="btn" onClick={ (restaurant) => {return this.props.handleClose(this.state.restaurant, this.props.selectedTrip)} }>Submit</button>
  //       </div>
  //     </div>