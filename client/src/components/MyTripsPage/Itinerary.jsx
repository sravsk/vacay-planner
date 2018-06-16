import React from 'react';
import {Grid, Button, Modal, Card, Icon, Image} from 'semantic-ui-react';
import axios from 'axios';
import AddRestModal from './AddRestModal.jsx';
import AddPOIModal from './AddPOIModal.jsx';
import moment from 'moment';

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dayIndex: 0,
      itinerary: [],
      modalOpen : false,
      selectedTrip: 0,
      poiModalOpen: false
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handlePOIOpen = this.handlePOIOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.hideModalAddItem = this.hideModalAddItem.bind(this);
  }

  handleOpen(selectedTrip, index, date) { // reference day by index
    this.setState({
      modalOpen : true,
      dayIndex: index,
      selectedTrip: selectedTrip
    })
  }

  handlePOIOpen(selectedTrip, index, date) { // reference day by index
    this.setState({
      poiModalOpen : true,
      dayIndex: index,
      selectedTrip: selectedTrip
    })
  }

  hideModalAddItem(item) {
    var params = {
      item: item,
      tripId: this.state.selectedTrip,
      dayIndex: this.state.dayIndex
    };
    // console.log('params to save in database', params);
    axios.post('/addItemToDay', params)
    .then(result => {
      this.setState({
        itinerary: result.data,
        modalOpen: false,
        poiModalOpen: false
      })
    })
  }

  handleClose(){
    this.setState({
      modalOpen : false,
      poiModalOpen: false
    })
  }

  render () {
    let toRender = [];
    let itinerary = [];
    if (this.state.itinerary.length == 0) {
      itinerary = this.props.itinerary;
    } else {
      itinerary = this.state.itinerary;
    }
    itinerary.forEach((day, index) => {
      var date = Object.keys(day)[0];
      var tripItems = day[date];
      // iterate over tripItems
      var tripDetails = tripItems.map((item, i) => {
        return (
          <li className="list-item" key={i}>
            <span className="text"><br/><br/>{i + 1}.&nbsp;&nbsp;{item}</span>
          </li>
        );
      });
      toRender[index] = (
        <Grid.Column key={index}>
          <Grid.Row>
           <Card>
            <Card.Content className="custom-grid-calendar">
              <Card.Header>
                {date.slice(0, -7)}
                  {tripDetails}
              </Card.Header>
              <Card.Description>

                 <Modal
                    trigger={ <Button onClick={() => this.handleOpen(this.props.selectedTrip, index, date)}>Add restaurant</Button>}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    size='small'
                    >
                    <Modal.Content>
                      <AddRestModal show={this.state.modalOpen} selectedRestaurants={this.props.restaurantsSelected} addRest={this.hideModalAddItem} />
                      <Modal.Actions>
                        <Button color='blue' onClick={this.handleClose} inverted>Close</Button>
                      </Modal.Actions>
                    </Modal.Content>
                 </Modal>

                 <Modal
                    trigger={ <Button onClick={() => this.handlePOIOpen(this.props.selectedTrip, index, date)}>Add point of interest</Button>}
                    open={this.state.poiModalOpen}
                    onClose={this.handleClose}
                    size='small'
                    >
                    <Modal.Content>
                      <AddPOIModal show={this.state.poiModalOpen} selectedPOI={this.props.pointsSelected} addPOI={this.hideModalAddItem} />
                      <Modal.Actions>
                        <Button color='blue' onClick={this.handleClose} inverted>Close</Button>
                      </Modal.Actions>
                    </Modal.Content>
                 </Modal>

              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Row>
        </Grid.Column>
      );
    })
    return (
      <Grid columns={3}>
        {toRender}
        </Grid>
    );
  }
}

export default Itinerary;
