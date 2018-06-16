import React from 'react';
import moment from 'moment';
import { Image, Item, Header, Card, Icon, Button } from 'semantic-ui-react';
import $ from 'jquery';

class POIList extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      poiSelected : []
    }
  }

  handleDeletePoi(poiId){
    $.ajax({
      type : 'DELETE',
      url : `trips/${this.props.selectedTrip}/poi/${poiId}`,
      success : (results) => {
        this.setState({
          poiSelected : JSON.parse(results)
        })
        location.reload()
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  render(){
    return(
      <div style={{marginTop: -25}}>
      {this.props.poiSelected.map((poi, index) => {
        return (
          <Card fluid key={poi.id}>
             <Item.Group>
               <Item>
                 <Item.Content>
                   <Item.Header style={ {marginTop: 20} } className='poi-name'>{ `${index + 1}. ${poi.name}` }</Item.Header>
                   <Item.Content>
                   <Item.Description>
                     <span className='poi-rating'>
                       {poi.rating}
                     </span>
                    <Item.Extra>
                      <Button onClick={this.handleDeletePoi.bind(this, poi.id)}>Delete Event</Button>
                    </Item.Extra>
                   </Item.Description>
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
}

export default POIList;









// import React from 'react';
// import moment from 'moment';
// import { Image, Item, Header, Card, Icon, Button } from 'semantic-ui-react';

// function POIList(props) {
//   return (
//     <div style={{marginTop: -25}}>
//       {props.poiSelected.map((poi, index) => {
//         return (
//           <Card fluid key={poi.id}>
//             <Item.Group>
//               <Item>
//                 <Item.Content>
//                   <Item.Header style={ {marginTop: 20} } className='poi-name'>{ `${index + 1}. ${poi.name}` }</Item.Header>
//                   <Item.Content>
//                     <span className='poi-rating'>
//                       {poi.rating}
//                     </span>
//                     <Button onClick={this.handleDeleteEvent.bind(this, poi.id)}>Delete Event</Button>
//                   </Item.Content>
//                 </Item.Content>
//               </Item>
//             </Item.Group>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// export default POIList;