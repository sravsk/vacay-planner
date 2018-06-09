import React from 'react';
import Proptypes from 'prop-types';
import moment from 'moment';
import { Grid, Accordion, Icon } from 'semantic-ui-react';
import SelectTrip from './SelectTrip.jsx';
import EventsList from './EventsList.jsx';
import RestaurantsList from './RestaurantsList.jsx';
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
    this.getAllTrips()
    this.updateSelection(this.state.selectedTrip);
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
        // render trip location on map
        var latLng = JSON.parse(data.latLng);
        this.mymap = L.map('map').setView([latLng.lat, latLng.lng], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW1lbmEiLCJhIjoiY2ppNmd3cHA4MDBwYzN2cDN1eGlzaWg1eCJ9.paiNLoRiwSNXMPF8qWvSEA', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'your.mapbox.access.token'
        }).addTo(this.mymap);
      }
    })
  }

  getAllTrips() {
    $.ajax({
      type: 'GET',
      url: `/trips`,
      success: result => {
        JSON.parse(result).length ?
          (
            this.setState({
              selectedTrip: JSON.parse(result)[0].id,
              allTrips: JSON.parse(result)
            })
          )
          : ''
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
              <div id="map"></div>
                <Accordion fluid styled>
                  <Accordion.Title style={ { color: '#d0021b', fontSize: 20} } active={activeIndex === 0} index={0} onClick={this.handleClick.bind(this)}>
                    <Icon name='dropdown'/>
                    Saved Events
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 0}>
                    <p> </p>
                    {!this.state.eventsSelected.length ? <p>No Saved Events</p> : <EventsList eventsSelected={this.state.eventsSelected}/>}
                  </Accordion.Content>
                  <Accordion.Title style={ {color: '#d0021b', fontSize: 20} } active={activeIndex === 1} index={1} onClick={this.handleClick.bind(this)}>
                    <Icon name='dropdown' />
                    Saved Restaurants
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === 1}>
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