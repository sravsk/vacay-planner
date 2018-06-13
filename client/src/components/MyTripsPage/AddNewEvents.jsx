import React from 'react';
import $ from 'jquery';
import ListAllEvents from './ListAllEvents.jsx';
import FoodAndEventsPage from '../FoodAndEventsPage/FoodAndEventsPage.jsx';
import {Button} from 'semantic-ui-react';

class AddNewEvents extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      eventsList : [],
      eventFavorites: []
    }

    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.handleAddEvent = this.handleAddEvent.bind(this);
  }

  componentDidMount(){
    this.getEventsByLocationAndDate()
  }

  toggleFavorite(listIndex, listName) {
      let selectedEvent = this.state.eventsList[listIndex];
      let newEventFavorites = this.state.eventFavorites.filter(eventfav => eventfav.id !== selectedEvent.id);
      if (newEventFavorites.length === this.state.eventFavorites.length) {
        newEventFavorites.push(this.state.eventsList[listIndex]);
      }
      this.setState({ eventFavorites: newEventFavorites });
  }

  handleAddEvent(){
    var tripId = this.props.selectedTrip;
    var data = {
      eventList: this.state.eventFavorites
    };
    $.ajax({
      type : 'POST',
      url : `/events/${tripId}`,
      data : data,
      success : (results) => {
        console.log("new events added to trip", results)
      },
      error : (err) => {
        console.log(err);
      }
    })

  }

  getEventsByLocationAndDate() {
    $.ajax({
      type: 'GET',
      url: `/events`,
      data: {
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        location: this.props.loc
      },
      dataType: 'json',
      success: result => {
        this.setState({
          eventsList: result
        });
      }
    });
  }

  render(){
    return(
        <div>
          <ListAllEvents eventsList={this.state.eventsList} eventFavorites={this.state.eventFavorites} toggleFavorite={this.toggleFavorite}/>
           <Button color="blue" onClick={this.handleAddEvent}>Add to trip</Button>
        </div>
      )
  }
}


export default AddNewEvents;