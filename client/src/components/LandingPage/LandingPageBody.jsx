import React from 'react';
import { Card, Grid, Form, Button, Segment, Header } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {formatDate, parseDate} from 'react-day-picker/moment';
import LocationSearchInput from './LocationSearchInput.jsx';

const LandingPageBody = (props) => (
  <Grid centered style={ {marginTop: 50} }>
  <div className="hero-image-wrap"></div>
    <Grid.Row>
      <Grid.Column width={10}><Card centered fluid className="landing-text">The new way to plan your next trip</Card></Grid.Column>
      <Grid.Column width={6} style={{ maxWidth: 450, marginTop : '2%'}}>
        <Card centered fluid>
          <Card.Content header='Vacation Planner' />
          <Card.Content extra>
            <Form onSubmit={() => {props.history.push('/foodandevents')}}>
              <Header as='h2' color='red' textAlign='center'>
                {' '}Where to?
              </Header>

              <Segment stacked>
                City, State:<br />
                <LocationSearchInput
                  loc={props.loc}
                  handleLocSelect={props.handleLocSelect}
                  handleLocChange={props.handleLocChange}
                />
                <br /><br />
                Start Date:<br />
                <DayPickerInput
                onDayChange={props.handleStartDayChange}
                formatDate={formatDate}
                parseDate={parseDate}
                placeholder={`${formatDate(new Date())}`}
                />
                <br /><br />
                End Date:<br />

                <DayPickerInput
                onDayChange={props.handleEndDayChange}
                formatDate={formatDate}
                parseDate={parseDate}
                placeholder={`${formatDate(new Date())}`}
                />
                <br /><br />

                <Form.Button content='Submit' fluid size='large' />
              </Segment>
            </Form>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);


export default LandingPageBody;