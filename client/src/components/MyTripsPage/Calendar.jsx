import React from 'react';



const Calendar = (props) => (
  <div>
    <div className="wrapper">
      {props.days.map((day, i) => (
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

export default Calendar;