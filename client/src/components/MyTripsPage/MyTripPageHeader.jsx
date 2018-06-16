import React from 'react';
import {Grid, Button, Modal} from 'semantic-ui-react';
import $ from 'jquery';
import AddNewEvents from './AddNewEvents.jsx';
import AddNewRestaurants from './AddNewRestaurants.jsx';
import AddNewPOI from './AddNewPOI.jsx';
import moment from 'moment';

class MyTripPageHeader extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      allTrips : this.props.allTrips,
      modalOpen : false,
      modalOpenRestaurant : false,
      modalOpenPOI : false
    }

    this.handleTripDelete = this.handleTripDelete.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenRestaurant = this.handleOpenRestaurant.bind(this);
    this.handleCloseRestaurant = this.handleCloseRestaurant.bind(this);
    this.handleOpenPOI = this.handleOpenPOI.bind(this);
    this.handleClosePOI = this.handleClosePOI.bind(this);
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

  handleOpenRestaurant() {
    this.setState({
      modalOpenRestaurant : true
    })
  }

  handleCloseRestaurant(){
    this.setState({
      modalOpenRestaurant : false
    })
  }


  handleOpenPOI() {
    this.setState({
      modalOpenPOI : true
    })
  }

  handleClosePOI(){
    this.setState({
      modalOpenPOI : false
    })
  }

  handleTripDelete(){
    var tripId = this.props.selectedTrip;
    $.ajax({
      type : 'DELETE',
      url : `/trips/${tripId}`,
      success : (results) => {
        this.setState({
          allTrips : JSON.parse(results)
        })
        //refresh page, not just header component
        location.reload();
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  render(){
      return (
        <div>
          {this.state.allTrips.map((trip, index) => {
              if(trip.id === this.props.selectedTrip) {
                return(
                   <Grid key={index}>
                      <Grid.Row>
                      <Grid.Column width={5}
                      style={trip.id === this.props.selectedTrip ? {color: '#4183c4', fontSize : '24px', margin : '10px 0 20px 0'} : null}
                      key={trip.id}
                      >
                      {/*{trip.tripName} Trip details*/}
                      <span>{moment(trip.end_date).diff(trip.start_date, 'days')} days in {trip.tripName}</span>
                      </Grid.Column>
                      <Grid.Column width={3}>
                      <Modal
                        trigger={<Button onClick={this.handleOpen} color="blue">Add Events</Button>}
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        size='small'
                        >
                          <Modal.Content>
                            <AddNewEvents startDate={trip.start_date} endDate={trip.end_date} loc={trip.loc} selectedTrip={this.props.selectedTrip} />
                             <Button color='blue' onClick={this.handleClose} inverted>
                              Close
                              </Button>
                          </Modal.Content>
                        </Modal>
                      </Grid.Column>
                      <Grid.Column width={3}>
                      <Modal
                      trigger={<Button onClick={this.handleOpenRestaurant} color="blue">Add Restaurants</Button>}
                        open={this.state.modalOpenRestaurant}
                        onClose={this.handleCloseRestaurant}
                        size='small'
                        >
                          <Modal.Content>
                            <AddNewRestaurants loc={trip.loc} selectedTrip={this.props.selectedTrip}  />
                             <Button color='blue' onClick={this.handleCloseRestaurant} inverted>
                              Close
                              </Button>
                          </Modal.Content>
                        </Modal>
                      </Grid.Column>

                      <Grid.Column width={2}>
                      <Modal
                        trigger={<Button onClick={this.handleOpenPOI} color="blue">Add POI</Button>}
                        open={this.state.modalOpenPOI}
                        onClose={this.handleClosePOI}
                        size='small'
                        >
                          <Modal.Content>
                            <AddNewPOI startDate={trip.start_date} endDate={trip.end_date} latLng={trip.latLng} selectedTrip={this.props.selectedTrip} />
                             <Button color='blue' onClick={this.handleClosePOI} inverted>
                              Close
                              </Button>
                          </Modal.Content>
                        </Modal>
                      </Grid.Column>

                      <Grid.Column width={3}>
                      <Button onClick={this.handleTripDelete} color="grey">Delete Trip</Button>
                      </Grid.Column>
                      </Grid.Row>
                </Grid>
                )
              }
            }
          )}
    </div>
    )
  }
}

export default MyTripPageHeader;




