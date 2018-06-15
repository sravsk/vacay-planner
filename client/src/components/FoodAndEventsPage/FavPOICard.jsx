import React from 'react';
import { Image, List } from 'semantic-ui-react';

const FavPOICard = (props) => (
  <List.Item>
    <Image />
    <List.Content>
      <List.Header>{props.poi.name}</List.Header>
    </List.Content>
  </List.Item>
);

export default FavPOICard;
