import React from 'react';

const Calendar = (props) => (
  <div>
    <div className="wrapper">
      {props.days.map((day, i) => (
        <div className="day" key={i}>{day}</div>
        ))
      }
    </div>
  </div>
);

export default Calendar;