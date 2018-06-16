import React from 'react';
import {Grid, Button, Modal, Card, Icon, Image} from 'semantic-ui-react';
import axios from 'axios';
import AddRestModal from './AddRestModal.jsx';
import moment from 'moment';

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dayIndex: 0,
      itinerary: [],
      modalOpen : false,
      selectedTrip: 0
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.hideModalAddRestaurant = this.hideModalAddRestaurant.bind(this);
  }

  handleOpen(selectedTrip, index, date) { // reference day by index
    this.setState({
      modalOpen : true,
      dayIndex: index,
      selectedTrip: selectedTrip
    })
  }

  hideModalAddRestaurant(restaurant) {
    var params = {
      restaurant: restaurant,
      tripId: this.state.selectedTrip,
      dayIndex: this.state.dayIndex
    };
    // console.log('params to save in database', params);
    axios.post('/addRestToDay', params)
    .then(result => {
      this.setState({
        itinerary: result.data,
        modalOpen: false
      })
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
                    trigger={ <Button onClick={() => this.handleOpen(this.props.selectedTrip, index, date)}>Add restaurant</Button>}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    size='small'
                    >
                    <Modal.Content>
                      <AddRestModal show={this.state.modalOpen} selectedRestaurants={this.props.restaurantsSelected} addRest={this.hideModalAddRestaurant} />
                      <Modal.Actions>
                       {/*} <Button onClick={(restaurant) => this.hideModalAddRestaurant(this.state.restaurant)}>Submit</Button> */}
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