import React from 'react';
import axios from 'axios';
import { Select, Button, Dropdown, Grid } from 'semantic-ui-react'
//import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

const format12 = 'h:mm a';

class AddRestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: '',
      time: moment().format('h:mm a'),
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

  onTimeSelect (value) {
    let newTime = moment(value, [format12]).format('h:mm a');
   // let newTime = moment(value, [format12]).format('HHmm');
  //  console.log(newTime);
    this.setState({
      time: newTime
    });
  }

  render() {
    const  value  = this.state.restaurant;
    let restaurants = this.props.selectedRestaurants;
    var newSelection;
    let optionItems = restaurants.map((restaurant) => {
      return (
           newSelection = {
            text : restaurant.name + restaurant.display_address,
            value : restaurant.name + restaurant.display_address
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
          <TimePicker
            showSecond={false}
            defaultValue={moment()}
            className="xxx"
            onChange={this.onTimeSelect.bind(this)}
            format={format12}
            minuteStep={5}
            use12Hours
            inputReadOnly 
          />
        <Button onClick={(restaurant) => this.props.addRest(this.state.restaurant, this.state.time)}>Submit</Button>
      </div>
    );
  }
}

export default AddRestModal;