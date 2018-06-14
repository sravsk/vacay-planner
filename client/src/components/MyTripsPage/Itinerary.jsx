import React from 'react';

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    let toRender = [];
    let itinerary = this.props.itinerary;
    for (var i = 0; i < itinerary.length; i++) {
      var date = Object.keys(itinerary[i])[0];
      toRender[i] = (
        <div className="day" key={i}>
          {date}
          <br/><br/>
          <button>Add restaurant</button><br/><br/>
          <button>Add point of interest</button>
        </div>
      );
    }
    return (
      <div className="wrapper">
        {toRender}
      </div>
    );
  }
}

export default Itinerary;