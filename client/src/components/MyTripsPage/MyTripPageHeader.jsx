import React from 'react';
import {Grid, Button, Modal} from 'semantic-ui-react';
import $ from 'jquery';
import AddNewEvents from './AddNewEvents.jsx';
import AddNewRestaurants from './AddNewRestaurants.jsx';

class MyTripPageHeader extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      allTrips : this.props.allTrips,
      modalOpen : false
    }

    this.handleTripDelete = this.handleTripDelete.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
                      <Grid.Column width={7}
                      style={trip.id === this.props.selectedTrip ? {color: '#4183c4', fontSize : '24px', margin : '10px 0 20px 0'} : null}
                      key={trip.id}
                      >
                      {trip.tripName} Trip details
                      </Grid.Column>
                      <Grid.Column width={3}>
                      <Modal
                        trigger={<Button onClick={this.handleOpen} color="blue">Add Events</Button>}
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        size='small'
                        >
                          <Modal.Content>
                            <AddNewEvents startDate={trip.start_date} endDate={trip.end_date} loc={trip.loc} selectedTrip={this.props.selectedTrip} open={this.state.modalOpen}onClose={this.handleClose} />
                             <Button color='blue' onClick={this.handleClose} inverted>
                              Close
                              </Button>
                          </Modal.Content>
                        </Modal>
                      </Grid.Column>
                      <Grid.Column width={3}>
                      <Modal
                        trigger={<Button onClick={this.handleOpen} color="blue">Add Restaurants</Button>}
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        size='small'
                        >
                          <Modal.Content>
                            <AddNewRestaurants startDate={trip.start_date} endDate={trip.end_date} loc={trip.loc} selectedTrip={this.props.selectedTrip} open={this.state.modalOpen}onClose={this.handleClose} />
                             <Button color='blue' onClick={this.handleClose} inverted>
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
