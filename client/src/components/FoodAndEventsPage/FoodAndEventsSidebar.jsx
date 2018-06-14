import React from 'react';
import { Button, Card, Input, Tab, Item, List } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import axios from 'axios';

import FavFoodCard from './FavFoodCard.jsx';
import FavEventCard from './FavEventCard.jsx';

class FoodAndEventsSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    }
  }

  componentDidMount() {
    axios.get('/user')
      .then(result => {
        this.setState({
          user: result.data
        });
        console.log('user', result.data)
      })
  }

  render () {
    console.log('user', this.state.user)
    const panes = [
    {
      menuItem: 'Favorites', render: () => (
        <Tab.Pane>
          <Input focus placeholder="Enter your trip name" value={this.props.tripName} onChange={this.props.onNameChange} /><br /><br />
          {this.props.foodFavorites.length > 0 ? <h2>Restaurants</h2> : ''}
          <List celled size='large'>
            {this.props.foodFavorites.map((restaurant, index) => {
              return <FavFoodCard restaurant={restaurant} key={'favfood' + restaurant.id} />;
            })}
          </List>
          {this.props.eventFavorites.length > 0 ? <h2>Events</h2> : ''}
          <List celled size='large'>
            {this.props.eventFavorites.map((event, index) => {
                return <FavEventCard event={event} key={'favevent' + event.id} />;
            })}
          </List>
          {this.props.foodFavorites.length + this.props.eventFavorites.length === 0 ? '' : (
            <div>
              {
                !(this.state.user) ?
                (<div>
                  <Button onClick={() => {this.props.history.push('/login')}} color='blue' fluid content='Login to Save' />
                  <hr />
                  <Button onClick={() => {this.props.history.push('/signup')}} fluid content='Not a member? Sign Up' />
                </div>)
                :
                <Button onClick={this.props.saveTrip} content='Save to My Trips' fluid />

              }
            </div>
          )}
        </Tab.Pane>
      )
    }
  ];
  return <Tab panes={panes} />;
  }
}

export default withRouter(FoodAndEventsSidebar);

