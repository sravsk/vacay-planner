import React from 'react';
import axios from 'axios';
import { Select, Button, Dropdown, Grid } from 'semantic-ui-react'

class AddPOIModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poi: '',
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
        <Button onClick={(poi) => this.props.addPOI(this.state.poi)}>Submit</Button>
      </div>
    );
  }
}

export default AddPOIModal;