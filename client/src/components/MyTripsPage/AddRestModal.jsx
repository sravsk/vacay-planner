import React from 'react';
import axios from 'axios';
import { Select, Button, Dropdown, Grid } from 'semantic-ui-react'
//import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

const format = 'h:mm a';

function onTimeChange(value) {
  console.log(value && value.format(format));
}

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

  handleChange  (e, value) {
   this.setState({
   value : value.value
     })
  }

  render() {
    const  value  = this.state.restaurant

    let restaurants = this.props.selectedRestaurants;

    var newSelection;
    let optionItems = restaurants.map((restaurant) => {
      return (
           newSelection = {
            text : restaurant.name + restaurant.display_address,
            value : restaurant.name + restaurant.display_address,
            id : restaurant.id,
            image_url : restaurant.image_url,
            tripId : restaurant.tripId
        }
      );
    });
    console.log("state here", this.state)

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
          <TimePicker
          showSecond={false}
          defaultValue={moment()}
          className="xxx"
          onChange={onTimeChange}
          format={format}
          minuteStep={5}
          use12Hours
          inputReadOnly
        />
          {/*<Button onClick={ (restaurant) => {return this.props.handleSubmitSelection(this.state.restaurant, this.props.selectedTrip)} }>Submit</Button>*/}
          </div>

    );
  }
}

export default AddRestModal;




// class AddRestModal extends React.Component {
//   constructor(props) {
//     super(props);
//     let rest = this.props.selectedRestaurants[0];
//     this.state = {
//       restaurant: `${rest.name}, ${rest.display_address}`,
//       dayIndex: this.props.dateIndex,
//       // latLng: {
//       //   lat: rest.restLat,
//       //   lng: rest.restLong
//       // }
//     }
//   }

//   onChange(event) {
//     this.setState({
//       [event.target.name]: event.target.value
//     });
//   }

//   render() {
//     let showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
//     let restaurants = this.props.selectedRestaurants;
//     let optionItems = restaurants.map((restaurant) => {
//       return (
//         <option key={restaurant.id}>{restaurant.name}, {restaurant.display_address}</option>
//       );
//     });
//     return (
//       <div className={showHideClassName}>
//       in modal component
//         <div className="modal-main">
//         <br/>
//         <h4>Add restaurant: </h4><select name='restaurant' value={this.state.restaurant} onChange={this.onChange.bind(this)}>
//           {optionItems}
//         </select><br/><br/>
//           <button className="btn" onClick={ (restaurant) => {return this.props.handleClose(this.state.restaurant, this.props.selectedTrip)} }>Submit</button>
//         </div>
//       </div>
//     );
//   }
// }
