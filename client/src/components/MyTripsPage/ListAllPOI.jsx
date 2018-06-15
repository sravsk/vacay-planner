import React from 'react';
import moment from 'moment';
import SaveButton from '../Buttons/SaveButton.jsx';
import { Button, Card, Image, Item, Label } from 'semantic-ui-react';

const ListAllPOI = (props) => {
  return(
  <div>
    {props.poiList.map((poi, index) => {
      return (
        <Card fluid key={poi.id}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header style={{ marginTop: 20 }} className='poi-name'>
                  {`${index + 1}. ${poi.name}`}
                </Item.Header>
                <Item.Extra>
                  <SaveButton
                    toggleFavorite={() => props.toggleFavorite(index, 'events')}
                    isSaved={props.poiFavorites.find(poifav => poifav.id === poi.id) ? true : false}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Card>
      )})
    }
  </div>
  )
}


export default ListAllPOI;

