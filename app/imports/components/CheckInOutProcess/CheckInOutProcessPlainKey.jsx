import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {propTypes} from 'react-router';

// Import components
import Button from '../Button/Button';
import CheckInCode from '../CheckInCode/CheckInCode';

class CheckInOutProcessPlainKey extends Component {
  constructor(props) {
    super(props);
  }

  setObjectReserved() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'reserved');
  }

  setObjectInUse() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'inuse');
  }

  setObjectAvailable() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'available');
  }

  setObjectOutOfOrder() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'outoforder');
  }

  render() {
    if (this.props.isProvider) {
        return this.renderButtonsForProvider();
    } else {
        return this.renderButtonsForUser();      
    }
  }

  renderButtonsForProvider() {
      if(this.props.object.state.state=='reserved') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Annuleer reservering!</Button>);
      } else if(this.props.object.state.state=='inuse') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Annuleer verhuur!</Button>);
      } else if(this.props.object.state.state=='outoforder') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Maak beschikbaar!</Button>);
      } 

      return (<Button onClick={() => this.setObjectOutOfOrder() } buttonStyle="huge">Maak niet beschikbaar!</Button>);
  }

  renderButtonsForUser() {
        return (
          <div style={s.base}>
          {this.props.object.state.state=='available' ?
            <Button onClick={() => this.setObjectReserved() } buttonStyle="huge">Reserveer!</Button> : <div /> }
          {this.props.object.state.state=='reserved' ? 
            <article>
              <Button onClick={() => this.setObjectInUse() } buttonStyle="huge">Neem mee!</Button>
              <CheckInCode code={this.props.object.lock.settings.pickupcode} />
              <Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Toch maar niet!</Button>
            </article>
            : <div /> }
          {this.props.object.state.state=='inuse' ? 
            <article>
              <CheckInCode code={this.props.object.lock.settings.returncode} title="Retourcode" />
              <Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Breng terug!</Button> 
            </article>
            : <div /> }
          {this.props.object.state.state=='outoforder' ? 
              <Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Maak beschikbaar!</Button> 
            : <div /> }
          </div>
        );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '20px 20px 0 20px',
    textAlign: 'center',
    minHeight: 'calc(100vh - 66px)',
  }
}

CheckInOutProcessPlainKey.propTypes = {
  locationId: PropTypes.string,
  object: PropTypes.object,
  isProvider: PropTypes.any
};

CheckInOutProcessPlainKey.defaultProps = {
  locationId: null,
  object: null,
  isProvider: false
}

export default CheckInOutProcessPlainKey;
