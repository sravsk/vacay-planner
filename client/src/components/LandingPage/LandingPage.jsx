import React from 'react';
import NavBar from '../NavBar/NavBar.jsx';
import LandingPageBody from './LandingPageBody.jsx';

const LandingPage = (props) => (
  <div>
    <NavBar />
    <LandingPageBody
      history={props.history}
      handleStartDayChange={props.handleStartDayChange}
      handleEndDayChange={props.handleEndDayChange}
      handleLocChange={props.handleLocChange}
      handleLocSelect={props.handleLocSelect}
      loc={props.loc}
    />

  </div>
);

export default LandingPage;