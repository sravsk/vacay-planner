import React from 'react';
import {Grid, Button, Modal, Card, Icon, Image} from 'semantic-ui-react';
import axios from 'axios';
import AddRestModal from './AddRestModal.jsx';
import moment from 'moment';

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRestModal: false,
      dayIndex: 0,
      itinerary: [],
       modalOpen : false
    }
    this.addRestaurant = this.addRestaurant.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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


  handleOpen() {
    this.setState({
      modalOpen : true
    })
  }

  handleClose(){
    this.setState({
      modalOpen : false
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
        <Grid.Column key={index}>
          <Grid.Row>
           <Card>
            <Card.Content className="custom-grid-calendar">
              <Card.Header>
                {date.slice(0, -7)}
                {tripDetails}
              </Card.Header>
              <Card.Description>
                 <Modal
                    trigger={ <Button onClick={this.handleOpen}>Add restaurant</Button>}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    size='small'
                    >
                    <Modal.Content>
                      <AddRestModal show={this.state.showRestModal}  selectedTrip={this.props.selectedTrip} selectedRestaurants={this.props.restaurantsSelected} />
                      <Modal.Actions>
                          <Button onClick={ (restaurant) => {this.hideModalAddRestaurant.bind(this) , this.props.selectedTrip} }>Submit</Button>
                         <Button color='blue' onClick={this.handleClose} inverted>Close</Button>
                      </Modal.Actions>
                    </Modal.Content>
                 </Modal>
                <Button>Add point of interest</Button>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Row>
        </Grid.Column>
      );
    })
    return (
      <Grid columns={3}>
        {toRender}
        </Grid>
    );
  }
}

export default Itinerary;


// <Button onClick={() => this.addRestaurant(this.props.selectedTrip, index, date)}>Add restaurant</Button><br/><br/>
//                 <AddRestModal show={this.state.showRestModal} handleClose={this.hideModalAddRestaurant.bind(this)} selectedTrip={this.props.selectedTrip} selectedRestaurants={this.props.restaurantsSelected} />
//                 <Button>Add point of interest</Button>