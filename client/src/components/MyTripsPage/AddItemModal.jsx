import React from 'react';
import axios from 'axios';
import { Select, Button, Dropdown, Grid } from 'semantic-ui-react'

class AddItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: ''
    }
  }

  handleChange(e, value) {
    this.setState({
      item : value.value
    })
  }

  render() {
    const value  = this.state.item;
    let items = this.props.selectedItem;
    var newSelection;
    let optionItems = restaurants.map((restaurant) => {
      return (
        newSelection = {
          text : item.name + item.display_address,
          value : item.name + item.display_address
        }
      );
    });
    return (
      <div>
        <h4>Select to add to Calendar</h4>
        <Dropdown
          placeholder="Select"
          onChange={this.handleChange.bind(this)}
          options={optionItems}
          value={value}
          selection/>
        <br/><br/>
        <Button onClick={(restaurant) => this.props.addItem(this.state.item)}>Submit</Button>
      </div>
    );
  }
}

export default AddItemModal;