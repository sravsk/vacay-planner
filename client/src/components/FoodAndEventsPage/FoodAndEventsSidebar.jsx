import React from 'react';
import { Button, Card, Input, Tab, Item, List } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import axios from 'axios';

import FavFoodCard from './FavFoodCard.jsx';
import FavEventCard from './FavEventCard.jsx';
import FavPOICard from './FavPOICard.jsx';

const FoodAndEventsSidebar = (props) => {
  const panes = [
    {
      menuItem: 'Favorites', render: () => (
        <Tab.Pane>
          <Input focus placeholder="Enter your trip name" value={props.tripName} onChange={props.onNameChange} /><br /><br />
          {props.foodFavorites.length > 0 ? <h2>Restaurants</h2> : ''}
          <List celled size='large'>
            {props.foodFavorites.map((restaurant, index) => {
              return <FavFoodCard restaurant={restaurant} key={'favfood' + restaurant.id} />;
            })}
          </List>
          {props.eventFavorites.length > 0 ? <h2>Events</h2> : ''}
          <List celled size='large'>
            {props.eventFavorites.map((event, index) => {
                return <FavEventCard event={event} key={'favevent' + event.id} />;
            })}
          </List>
          {props.poiFavorites.length > 0 ? <h2>Points of Interest</h2> : ''}
          <List celled size='large'>
            {props.poiFavorites.map((poi, index) => {
              return <FavPOICard poi={poi} key={'favpoi' + poi.id} />
            })}
          </List>
          {props.foodFavorites.length + props.eventFavorites.length === 0 ? '' : (
            <div>
              {
                !(props.user) ?
                (<div>
                  <Button onClick={() => {props.history.push('/login')}} color='blue' fluid content='Login to Save' />
                  <hr />
                  <Button onClick={() => {props.history.push('/signup')}} fluid content='Not a member? Sign Up' />
                </div>)
                :
                <Button onClick={props.saveTrip} content='Save to My Trips' fluid />

              }
            </div>
          )}
        </Tab.Pane>
      )
    }
  ];
  return <Tab panes={panes} />;
}

export default withRouter(FoodAndEventsSidebar);

