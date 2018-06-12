import React from 'react';
import {Grid, Button} from 'semantic-ui-react';
import $ from 'jquery';

class MyTripPageHeader extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      allTrips : this.props.allTrips
    }

    this.handleTripDelete = this.handleTripDelete.bind(this);
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
                   <Grid>
                      <Grid.Row key={index}>
                      <Grid.Column width={7}
                      style={trip.id === this.props.selectedTrip ? {color: '#4183c4', fontSize : '24px', margin : '10px 0 20px 0'} : null}
                      key={trip.id}
                      >
                      {trip.tripName} Trip details
                      </Grid.Column>
                      <Grid.Column width={3}>
                      <Button color="blue">Add Events</Button>
                      </Grid.Column>
                      <Grid.Column width={3}>
                      <Button color="blue">Add Restaurants</Button>
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
