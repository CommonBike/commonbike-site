import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';
import { StyleProvider } from '../../StyleProvider.js'

import { getUserDescription } from '/imports/api/users.js';

// Import components
import Button from '../Button/Button';
import CheckInCode from '../CheckInCode/CheckInCode';
import TextField from '../TextField/TextField.jsx';

class CheckInOutProcessPlainKey extends CheckInOutProcessBase {
  constructor(props) {
    super(props);

    this.state = { showCodeEntry: false, returncodevalid: "" }
  }

  confirmCode() {
    this.setObjectAvailable();
  }

  checkCode() {
    this.setState({showCodeEntry:false});

    this.setObjectAvailable();

    var userDescription = getUserDescription(Meteor.user());
    var description='Locatiecode ' + ReactDOM.findDOMNode(this.refs.code).value + ' ingevoerd door gebruiker ' + userDescription;
    Meteor.call('transactions.addTransaction', 'ENTER_LOCATIONCODE', description, Meteor.userId(), this.props.object.locationId, this.props.object._id);
  }

  renderButtonsForUser() {
    self = this;

    return (
      <div>
      {this.props.object.state.state=='available' ?
        <Button style={s.button} onClick={() => this.setObjectReserved() } buttonStyle="hugeSmallerFont">RESERVEER</Button> : <div /> }
      {this.props.object.state.state=='reserved' ?
        <div>
          <p style={s.explanationText} hidden>
            Uw fiets ophalen? Druk op de knop <b>Stap op</b>
          </p>
          <Button style={s.button} onClick={() => this.setObjectInUse() } buttonStyle="hugeSmallerFont">STAP OP</Button>
          <Button style={s.button} onClick={() => this.setObjectAvailable()} buttonStyle="hugeSmallerFont">ANNULEER</Button>
        </div>
        : <div /> }
      {this.props.object.state.state=='inuse' ?
           this.state.showCodeEntry ?
              <div>
                <ul style={s.list}>
                  <li style={s.listitem}>Zet s.v.p. <b>{this.props.object.title}</b> afgesloten weg</li>
                  <li style={s.listitem}>en lever de sleutel in bij de medewerker.<br /></li>
                  <li style={s.listitem}>Vraag om de <b>locatiecode</b> en vul deze hieronder in.<br /><br /></li>
                  <li style={s.listitem}><TextField required="required" type="code" ref="code" placeholder="locatiecode" name="code" style={s.textfield}/></li>
                  <li style={s.listitem}><Button style={s.button} onClick={() => this.checkCode() } buttonStyle="hugeSmallerFont">CODE INVULLEN</Button></li>
                  <Button style={s.button} onClick={() => this.setState({ showCodeEntry: false}) } buttonStyle="hugeSmallerFont">ANNULEER</Button>
                </ul>
              </div>
            :
              <div>
                <ul style={s.list}>
                  <li style={s.listitem}>Toon dit scherm aan de medewerker</li>
                  <li style={s.listitem}>en vraag om de sleutel.</li>
                  <li style={s.listitem}>&nbsp;</li>
                  <li style={Object.assign({}, s.listitem, s.largeFont)}><b>{this.props.object.title}</b></li>
                  <li style={s.listitem}>&nbsp;</li>
                </ul>
                <Button style={s.button} onClick={() => this.setState({ showCodeEntry: true}) } buttonStyle="hugeSmallerFont">TERUGBRENGEN</Button>
              </div>

          : <div /> }
      {this.props.object.state.state=='outoforder' ?
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">STEL IN BEDRIJF</Button>
        : <div /> }
      </div>
    );
  }
}

var s = StyleProvider.getInstance().checkInOutProcess;

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
