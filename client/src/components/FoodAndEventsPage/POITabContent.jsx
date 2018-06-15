import React from 'react';
import moment from 'moment';
import SaveButton from '../Buttons/SaveButton.jsx';
import { Button, Card, Image, Item, Label } from 'semantic-ui-react';

const POITabContent = (props) => (
  <div>
    {props.poiList.map((poi, i) => {
      return(
        <Card fluid key={poi.id}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header style={{ marginTop: 20 }} className='poi-name'>
                  {`${i + 1}. ${poi.name}`}
                </Item.Header>
                <Item.Extra>
                  <SaveButton
                    toggleFavorite={() => props.toggleFavorite(i, 'poi')}
                    isSaved={props.poiFavorites.find(poiFav => poiFav.id === poi.id) ? true : false} />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Card>
      )
    })}
  </div>
)

export default POITabContent;