import React from 'react';
import $ from 'jquery';
import ListAllRestaurants from './ListAllRestaurants.jsx';
import {Button} from 'semantic-ui-react';

class AddNewRestaurants  extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      restaurantList : [],
      foodFavorites: []
    }

    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  componentDidMount(){
    this.getRestaurantsByLocation()
  }

  toggleFavorite(listIndex, listName) {
      let selectedFood = this.state.restaurantList[listIndex];
      let newFoodFavorites = this.state.foodFavorites.filter(foodfav => foodfav.id !== selectedFood.id);
      if (newFoodFavorites.length === this.state.foodFavorites.length) {
        newFoodFavorites.push(this.state.restaurantList[listIndex]);
      }
      this.setState({ foodFavorites: newFoodFavorites });
  }



  getRestaurantsByLocation() {
    $.ajax({
      type: 'GET',
      url: `/restaurants/${this.props.loc}`,
      success: result => {
        this.setState({
          restaurantList: result.businesses
        });
      }
    });
  }

  render(){
    return(
        <div>
          <ListAllRestaurants restaurantList={this.state.restaurantList} foodFavorites={this.state.foodFavorites} toggleFavorite={this.toggleFavorite}/>
           <Button color="blue" onClick={(restaurants) => this.props.handleAddRestaurant(this.state.foodFavorites)}>Add to trip</Button>
        </div>
      )
  }
}


export default AddNewRestaurants;