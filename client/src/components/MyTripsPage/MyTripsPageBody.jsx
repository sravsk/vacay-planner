import React from 'react';
import Proptypes from 'prop-types';
import moment from 'moment';
import { Grid, Accordion, Icon } from 'semantic-ui-react';
import SelectTrip from './SelectTrip.jsx';
import EventsList from './EventsList.jsx';
import RestaurantsList from './RestaurantsList.jsx';
import MyTripPageHeader from './MyTripPageHeader.jsx';
import $ from 'jquery';

class MyTripsPageBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTrip: 1,
      allTrips: [],
      eventsSelected: [],
      restaurantsSelected: [],
      activeIndex: null,
      loc: '',
      latLng: {}
    };
    this.updateSelection = this.updateSelection.bind(this);
  }

  componentDidMount() {
    this.getAllTrips();
  }

  handleClick(e, titleProps) {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({
      activeIndex: newIndex
    })
    this.updateSelection(this.state.selectedTrip)
  }

  updateSelection(tripId) {
    this.setState(() => {
      return {
        selectedTrip: tripId
      }
    })
    this.getTripDetailsById(tripId);
  }

  getTripDetailsById(tripId) {
    $.ajax({
      type: 'GET',
      url: `/trips/${tripId}`,
      success: result => {
        var data = JSON.parse(result)
        // console.log(JSON.parse(result))
        this.setState({
          eventsSelected: data.events,
          restaurantsSelected: data.restaurants,
          loc: data.loc,
          latLng: JSON.parse(data.latLng)
        })
        // if map container is already initialized, remove map
        if (this.mymap) {
          this.mymap.eachLayer(function(layer) {
            layer.remove();
          });
          this.mymap.remove();
          this.mymap = null;
        }
        // render trip location on map
        var latLng = JSON.parse(data.latLng);
        // instantiate leaflet map
        this.mymap = L.map('map').setView([latLng.lat, latLng.lng], 13);
        // add tile layer
        L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${require('./../../../../config.js').MAPBOX_TOKEN}`, {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'your.mapbox.access.token'
        }).addTo(this.mymap);

        // marker for restaurants
        var restaurantMarker = L.AwesomeMarkers.icon({
          icon: 'cutlery',
          markerColor: 'red'
        });
        // Add a marker for each restaurant
        data.restaurants.forEach(restaurant => {
          L.marker([restaurant.restLat, restaurant.restLong], {icon: restaurantMarker}).addTo(this.mymap)
            .bindPopup(restaurant.name);
        });

        // marker for events
        var eventMarker = L.AwesomeMarkers.icon({
          icon: 'info-sign',
          markerColor: 'green'
        });
        // Add a marker for each event
        data.events.forEach(event => {
          L.marker([event.venueLat, event.venueLong], {icon: eventMarker}).addTo(this.mymap)
            .bindPopup(`${event.name} at ${event.venueName}`);
        });

      }
    })
  }

  getAllTrips() {
    $.ajax({
      type: 'GET',
      url: `/trips`,
      success: result => {
        var data = JSON.parse(result);
        if (data.length) {
          this.setState({
              selectedTrip: data[0].id,
              allTrips: data
            })
          this.updateSelection(this.state.selectedTrip);
        }
      }
    })
  }

  render() {
    const {activeIndex} = this.state
    return (
      <div>
        <Grid columns='equal' style={ { marginTop: 50, backgroundColor: 'white'} }>
          <Grid.Column floated='left' width={3}>
            <SelectTrip
              selectedTrip = {this.state.selectedTrip}
              allTrips =  {this.state.allTrips}
              onSelect = {this.updateSelection}
            />
          </Grid.Column>
          {this.state.allTrips.length ?
            (
              <Grid.Column floated='right' width={13}>
              <MyTripPageHeader allTrips = {this.state.allTrips} selectedTrip = {this.state.selectedTrip}/>
                <Accordion fluid styled>
                <Accordion.Title style={ { color: '#d0021b', fontSize: 20} } active={activeIndex === 0} index={0} onClick={this.handleClick.bind(this)}>
                    <Icon name='dropdown'/>
                    Map
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 0}>
                    <div id="map"></div>
                  </Accordion.Content>
                  <Accordion.Title style={ { color: '#d0021b', fontSize: 20} } active={activeIndex === 1} index={1} onClick={this.handleClick.bind(this)}>
                    <Icon name='dropdown'/>
                    Saved Events
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 1}>
                    <p> </p>
                    {!this.state.eventsSelected.length ? <p>No Saved Events</p> : <EventsList eventsSelected={this.state.eventsSelected}/>}
                  </Accordion.Content>
                  <Accordion.Title style={ {color: '#d0021b', fontSize: 20} } active={activeIndex === 2} index={2} onClick={this.handleClick.bind(this)}>
                    <Icon name='dropdown' />
                    Saved Restaurants
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 2}>
                    <p> </p>
                    {!this.state.restaurantsSelected.length ? <p>No Saved Restaurants</p> : <RestaurantsList restaurantsSelected={this.state.restaurantsSelected}/>}
                  </Accordion.Content>
                </Accordion>
              </Grid.Column>
            )
          :
            (<span style={ {color: '#d0021b', fontSize: 30, align: 'center', marginRight: 450, marginTop: 50} }> No Saved Trips </span>)}
        </Grid>
      </div>
    )
  }
}

export default MyTripsPageBody;