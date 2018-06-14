import React from 'react';
import axios from 'axios';

class AddRestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: `${this.props.selectedRestaurants[0].name}, ${this.props.selectedRestaurants[0].display_address}`,
      dateIndex: this.props.dateIndex
    }
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
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
      <div className={showHideClassName}>
      in modal component
        <div className="modal-main">
        <br/>
        <h4>Add restaurant: </h4><select name='restaurant' value={this.state.restaurant} onChange={this.onChange.bind(this)}>
          {optionItems}
        </select><br/><br/>
          <button className="btn" onClick={ (restaurant) => {return this.props.handleClose(this.state.restaurant, this.props.selectedTrip)} }>Submit</button>
        </div>
      </div>
    );
  }
}

export default AddRestModal;