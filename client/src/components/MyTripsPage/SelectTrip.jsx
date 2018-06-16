import React from 'react';
import Proptypes from 'prop-types';
import { Menu } from 'semantic-ui-react'

function SelectTrip(props) {
  return (
    <Menu size='large' fixed='left' vertical style={{marginTop: 50}}>
      {props.allTrips.map(trip => {
        return (
          <Menu.Item
            style={trip.id === props.selectedTrip ? {color: '#d0021b'} : null}
            onClick={props.onSelect.bind(null, trip.id)}
            key={trip.id}
          >
            {trip.tripName}
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

SelectTrip.propTypes = {
  selectedTrip: Proptypes.number.isRequired,
  onSelect: Proptypes.func.isRequired
};


export default SelectTrip;