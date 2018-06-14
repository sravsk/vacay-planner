import React from 'react';

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onAddRestToItinerary: false
    }
    this.addRestaurant = this.addRestaurant.bind(this);
  }

  addRestaurant (index, date) { // reference day by index i
    console.log('In addRestaurant function', index, date)
  }


  render () {
    let toRender = [];
    let itinerary = this.props.itinerary;
    itinerary.forEach((day, index) => {
      var date = Object.keys(day)[0];
      toRender[index] = (
        <div className="day" key={index}>
          {date}
          <br/><br/>
          <button onClick={() => this.addRestaurant(index, date)}>Add restaurant</button><br/><br/>
          <button>Add point of interest</button>
        </div>
      );
    })
    return (
      <div className="wrapper">
        {toRender}
      </div>
    );
  }
}

export default Itinerary;