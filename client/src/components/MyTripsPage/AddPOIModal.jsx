import React from 'react';
import axios from 'axios';
import { Select, Button, Dropdown, Grid } from 'semantic-ui-react'
import moment from 'moment';
import TimePicker from 'rc-time-picker';
const format12 = 'h:mm a';

class AddPOIModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poi: '',
      time: moment().format('h:mm a'),
      latLng: {
        lat: 0,
        lng: 0
      }
    }
  }

  handleChange(e, value) {
    this.setState({
      poi : value.value
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
    const value  = this.state.poi;
    let poi = this.props.selectedPOI;
    var newSelection;
    let optionItems = poi.map((item) => {
      return (
        newSelection = {
          text : item.name,
          value : item.name
        }
      );
    });
    return (
      <div>
        <h4>Select point of interest to add to Calendar</h4>
        <Dropdown
          placeholder="Select a point of interest"
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
        <Button onClick={(poi) => this.props.addPOI(this.state.poi, this.state.time)}>Submit</Button>
      </div>
    );
  }
}

export default AddPOIModal;