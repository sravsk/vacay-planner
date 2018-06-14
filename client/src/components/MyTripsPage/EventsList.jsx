import React from 'react';
import moment from 'moment';
import { Image, Item, Header, Card, Label, Button } from 'semantic-ui-react';
import $ from 'jquery';

class EventsList extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      eventsSelected : this.props.eventsSelected
    }
  }

  handleDeleteEvent(eventId){
    $.ajax({
      type : 'DELETE',
      url : `trips/${this.props.selectedTrip}/events/${eventId}`,
      success : (results) => {
        this.setState({
          eventsSelected : JSON.parse(results)
        })
      },
      error : (err) => {
        console.log(err);
      }
    })
  }


  render(){
    return(
       <div style={{marginTop: -25}}>
        {this.state.eventsSelected.map((event, index) => {
          return (
            <Card fluid key={event.id}>
              <Item.Group>
                <Item>
                  <Item.Image className='event-image'
                    size='small'
                    src={ event.eventImg }
                    style={ {margin: 15} }
                  />
                  <Item.Content>
                    <Item.Header style={{marginTop: 20}} className='event-name'>
                      {`${index + 1}. ${event.name}`}
                    </Item.Header>
                    <Item.Description>
                      <strong>{event.venueName}, </strong>{event.venueAddress}
                    </Item.Description>
                    <Item.Extra>
                      <Label
                        style={ {textTransform: 'uppercase', backgroundColor: '#2185d0', color: '#FFF', 'padding': '0.7rem'} }
                      >
                        {moment(event.start_date).format('MMM DD ddd')}
                      </Label>
                      <Button onClick={this.handleDeleteEvent.bind(this, event.id)}>Delete Event</Button>
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
}




export default EventsList;
