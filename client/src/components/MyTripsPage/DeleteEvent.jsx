import React from 'react';
import { Button } from 'semantic-ui-react';
import $ from 'jquery';


class DeleteEvent extends React.Component {
  constructor(props){
    super(props)

    this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
  }

  handleDeleteEvent(){
    var EventID = this.props.id;
    $.ajax({
      type : 'DELETE',
      url : `/events/${EventID}`,
      success : (results) => {
        console.log("deleted event", results)
      },
      error : (err) => {
        console.log(err);
      }
    })
  }

  render(){
    return(
        <div>
          <Button onClick={this.handleDeleteEvent} color="grey">Delete Event</Button>
        </div>
      )
  }
}
export default DeleteEvent;