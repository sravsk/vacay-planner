import React from 'react';
import SaveButton from '../Buttons/SaveButton.jsx';
import { Button, Card, Image, Icon, Item } from 'semantic-ui-react';

const ListAllRestaurants = (props) => (
  <div>
    {props.restaurantList.map((restaurant, index) => {
      return (
        <Card fluid key={restaurant.id}>
          <Item.Group>
            <Item>
              <Item.Image className='restaurant-image'
                size='small'
                src={restaurant.image_url}
                style={{ margin: 15 }}
              />
              <Item.Content>
                <Item.Header style={{ marginTop: 20 }} className='restaurant-name'>{`${index + 1}. ${restaurant.name}`}</Item.Header>
                <Item.Image>
                  <span className='restaurant-rating'>
                    <Image
                      src={`/media/yelp_stars/regular_${(restaurant.rating).toString().replace('.5', '_half')}.png`}
                    />
                  </span>
                  <span style={{ marginLeft: 5 }} > {restaurant.review_count} reviews</span>
                </Item.Image>
                <Item.Description>
                  {restaurant.location.display_address.map(address => {
                    return address
                  }).join(', ')}
                </Item.Description>
                <Item.Extra>
                  {restaurant.price ?
                    (<span>{restaurant.price}</span>) : '---'
                  }
                  <span style={{ paddingLeft: 5 }}>{` ● `}</span>
                  <Icon name='food' fitted style={{ paddingLeft: 10 }} /> {restaurant.categories.map(category => {
                    return category.title
                  }).join(', ')}
                  <SaveButton
                    toggleFavorite={() => props.toggleFavorite(index, 'food')}
                    isSaved={props.foodFavorites.find(foodfav => foodfav.id === restaurant.id) ? true : false}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Card>
      )
    })}
  </div>
)

export default ListAllRestaurants;
