import React from 'react';
import NavBar from '../NavBar/NavBar.jsx';
import FoodAndEventsPageBody from './FoodAndEventsPageBody.jsx';
import FoodAndEventsSidebar from './FoodAndEventsSidebar.jsx';
import { Tab, Grid } from 'semantic-ui-react';
import $ from 'jquery';

class FoodAndEventsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantList: [],
      eventsList: [],
      foodFavorites: [],
      eventFavorites: [],
      tripName: ""
    };
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.saveTrip = this.saveTrip.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  toggleFavorite(listIndex, listName) {
    if (listName === 'food') {
      let selectedFood = this.state.restaurantList[listIndex];
      let newFoodFavorites = this.state.foodFavorites.filter(foodfav => foodfav.id !== selectedFood.id);
      if (newFoodFavorites.length === this.state.foodFavorites.length) {
        newFoodFavorites.push(this.state.restaurantList[listIndex]);
      }
      this.setState({ foodFavorites: newFoodFavorites });
    } else {
      let selectedEvent = this.state.eventsList[listIndex];
      let newEventFavorites = this.state.eventFavorites.filter(eventfav => eventfav.id !== selectedEvent.id);
      if (newEventFavorites.length === this.state.eventFavorites.length) {
        newEventFavorites.push(this.state.eventsList[listIndex]);
      }
      this.setState({ eventFavorites: newEventFavorites });
    }
  }

  handleNameChange(event) {
    this.setState({tripName: event.target.value});
  }

  saveTrip() {
    var data = {
      user:  {email: 'ted.green@test.com'},
      trip: {
        start_date: this.props.startDate,
        end_date: this.props.endDate,
        name: this.state.tripName,
        loc: this.props.inputLocation,
        latLng: this.props.latLng
      },
      eventList: this.state.eventFavorites,
      restaurantList: this.state.foodFavorites
    };
    $.ajax({
      method: 'POST',
      url: '/trips',
      data: data,
      success: (data) => {
        console.log('trip saved');
      },
      error: (err) => {console.log(err)},
      dataType: 'json'
    })
    this.setState({
      foodFavorites: [],
      eventFavorites: [],
      tripName: ""
    });
  }

  componentDidMount() {
    this.getRestaurantsByLocation();
    this.getEventsByLocationAndDate();
  }

  getRestaurantsByLocation() {
    $.ajax({
      type: 'GET',
      url: `/restaurants/${this.props.inputLocation}`,
      success: result => {
        this.setState({
          restaurantList: result.businesses
        });
      }
    });
  }

  getEventsByLocationAndDate() {
    $.ajax({
      type: 'GET',
      url: `/events`,
      data: {
        startDate: this.props.startDate,
        endDate: this.props.endDate,
        location: this.props.inputLocation
      },
      dataType: 'json',
      success: result => {
        this.setState({
          eventsList: result
        });
      }
    });
  }

  render() {
    return (
      //Column width must add up to 16
      <Grid style={ {marginTop: 50} }>
        <Grid.Row>
          <Grid.Column floated="right">
            <NavBar />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}>
            <FoodAndEventsPageBody
              restaurantList={this.state.restaurantList}
              eventsList={this.state.eventsList}
              foodFavorites={this.state.foodFavorites}
              eventFavorites={this.state.eventFavorites}
              toggleFavorite={this.toggleFavorite}
            />
          </Grid.Column>
          <Grid.Column width={6}>
            <FoodAndEventsSidebar
              user={this.props.user}
              foodFavorites={this.state.foodFavorites}
              eventFavorites={this.state.eventFavorites}
              saveTrip={this.saveTrip}
              tripName={this.state.tripName}
              onNameChange={this.handleNameChange}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
};

export default FoodAndEventsPage;