import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {propTypes} from 'react-router';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';

// Import components
import Button from '../Button/Button';
import CheckInCode from '../CheckInCode/CheckInCode';

class CheckInOutProcessPlainKey extends CheckInOutProcessBase {
  constructor(props) {
    super(props);
  }

  renderButtonsForUser() {
    return (
      <div style={s.base}>
      {this.props.object.state.state=='available' ?
        <Button style={s.button} onClick={() => this.setObjectReserved() } buttonStyle="huge">Reserveer!</Button> : <div /> }
      {this.props.object.state.state=='reserved' ? 
        <article>
          <Button style={s.button} onClick={() => this.setObjectInUse() } buttonStyle="huge">Neem mee!</Button>
          <CheckInCode code={this.props.object.lock.settings.pickupcode} />
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">Toch maar niet!</Button>
        </article>
        : <div /> }
      {this.props.object.state.state=='inuse' ? 
        <article>
          <CheckInCode code={this.props.object.lock.settings.returncode} title="Retourcode" />
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">Breng terug!</Button> 
        </article>
        : <div /> }
      {this.props.object.state.state=='outoforder' ? 
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">Maak beschikbaar!</Button> 
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
  },

  button: {
    display: 'block'
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
