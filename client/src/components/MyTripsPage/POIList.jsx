import React from 'react';
import moment from 'moment';
import { Image, Item, Header, Card, Icon } from 'semantic-ui-react';

function POIList(props) {
  return (
    <div style={{marginTop: -25}}>
      {props.poiSelected.map((poi, index) => {
        return (
          <Card fluid key={poi.id}>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Item.Header style={ {marginTop: 20} } className='poi-name'>{ `${index + 1}. ${poi.name}` }</Item.Header>
                  <Item.Content>
                    <span className='poi-rating'>
                      {poi.rating}
                    </span>
                  </Item.Content>
                </Item.Content>
              </Item>
            </Item.Group>
          </Card>
        )
      })}
    </div>
  )
}

export default POIList;