import React from 'react';

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var days = this.props.itinerary.map(day => {
      return Object.keys(day)[0]
    });
    // console.log(days)
    return (
      <div>
        <div className="wrapper">
          {days.map((day, i) => (
            <div className="day" key={i}>
              {day}
              <br/><br/>
              <button>Add restaurant</button><br/><br/>
              <button>Add point of interest</button>
            </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default Itinerary;