import React from 'react';
import $ from 'jquery';
import ListAllPOI from './ListAllPOI.jsx';
import {Button} from 'semantic-ui-react';

class AddNewPOI extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      poiList : [],
      poiFavorites: []
    }
    console.log(this.props.poiFavorites)
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.handleAddPOI = this.handleAddPOI.bind(this);
  }

  componentDidMount(){
    this.getPOIByLocation()
  }

  toggleFavorite(listIndex, listName) {
      let selectedPOI = this.state.poiList[listIndex];
      let newPOIFavorites = this.state.poiFavorites.filter(poifav => poifav.id !== selectedPOI.id);
      if (newPOIFavorites.length === this.state.poiFavorites.length) {
        newPOIFavorites.push(this.state.poiList[listIndex]);
      }
      this.setState({ poiFavorites: newPOIFavorites });
  }

  handleAddPOI(){
    var tripId = this.props.selectedTrip;
    var data = {
      poiList: this.state.poiFavorites
    };
    $.ajax({
      type : 'POST',
      url : `/poi/${tripId}`,
      data : data,
      success : (results) => {
        console.log("new poi added to trip", results)
      },
      error : (err) => {
        console.log(err);
      }
    })

  }

  getPOIByLocation() {
    $.ajax({
      type: 'GET',
      url: '/poi/',
      data: {
        latLng: this.props.latLng
      },
      success: result => {
        this.setState({
          poiList: result.businesses
        });
      }
    });
  }

  render(){
    return(
        <div>
          <ListAllPOI poiList={this.state.poiList} poiFavorites={this.state.poiFavorites} toggleFavorite={this.toggleFavorite}/>
           <Button color="blue" onClick={this.handleAddPOI}>Add to trip</Button>
        </div>
      )
  }
}


export default AddNewPOI;