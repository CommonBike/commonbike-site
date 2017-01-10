import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {propTypes} from 'react-router';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';

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

  renderButtonsForUser() {
    self = this;

    return (
      <div style={s.base}>
      {this.props.object.state.state=='available' ?
        <Button style={s.button} onClick={() => this.setObjectReserved() } buttonStyle="huge">Reserveer!</Button> : <div /> }
      {this.props.object.state.state=='reserved' ? 
        <div style={s.base}>
          <ul style={s.list}>
            <li style={s.listitem}>Uw fiets ophalen?</li>
            <li style={s.listitem}>Druk op de knop <b>HUUR</b></li>
            <li style={s.listitem}>voor een huurcode</li>
            <li style={s.listitem}>Let op: uw huurperiode start op het moment</li>
            <li style={s.listitem}>dat de huurcode is afgegeven!</li>
          </ul>
          <Button style={s.button} onClick={() => this.setObjectInUse() } buttonStyle="huge">HUUR</Button>
          <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">ANNULEER!</Button>
        </div>
        : <div /> }
      {this.props.object.state.state=='inuse' ? 
           this.state.showCodeEntry ? 
              <div style={s.base}>
                <ul style={s.list}>
                  <li style={s.listitem}>Zet svp <b>{this.props.object.title}</b> afgesloten weg</li>
                  <li style={s.listitem}>en lever de sleutel in bij de medewerker</li>
                  <li style={s.listitem}>vraag om de <b>locatiecode</b> en</li>
                  <li style={s.listitem}>vul deze hieronder in om de huurperiode te beeindigen</li>
                  <li style={s.listitem}><TextField type="code" ref="code" placeholder="locatiecode" name="code" style={s.textfield}/></li>
                  <li style={s.listitem}><Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="huge">CODE INVOEREN</Button></li>
                </ul>
              </div>
            : 
              <div style={s.base}>
                <ul style={s.list}>
                  <li style={s.listitem}>Toon onderstaande huurcode</li>
                  <li style={s.listitem}>aan de medewerker en vraag om de sleutel</li>
                  <CheckInCode title="HUURCODE" code={this.props.object.lock.settings.keyid} />
                  <li style={s.listitem}>Hiermee kunt u <b>{this.props.object.title}</b> openen</li>
                </ul>
                <Button style={s.button} onClick={() => this.setState(prevState => ({ showCodeEntry: ! prevState.showCodeEntry})) } buttonStyle="huge">TERUGBRENGEN</Button> 
              </div>
          
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
  },

  list: {
    margin: '0 auto',
    textAlign: 'center',
    listStyle: 'none',
  },

  listitem: {
    padding: '0 10px 0 0',
    margin: '0 auto',
    textAlign: 'center',
    minHeight: '40px',
    fontSize: '1.2em',
    fontWeight: '500',
    listStyle: 'none',
  },

  image: {
    padding: '20px 20px 0 20px',
    textAlign: 'center',
    maxHeight: '250px',
  },

  box: {
    border: '2px solid black',
    backgroundColor: '#fff',
    width: '100%',
    marginTop: '10px',
    marginRight: 'auto',
    marginBottom: '10px',
    marginLeft: 'auto',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '20px',
  },

  icon: {
    width:'32px',
    height:' auto'
  },

  images: {
    details: 'https://cdn1.iconfinder.com/data/icons/general-9/500/more-48.png',
  },

  textField: {
    display: 'inline-block',
    width: '300px',
    maxWidth: '100%',
  },

  codeentry: {
    backgroundColor: '#fff',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '20px',
    padding: '10px',
    margin: '2px'
  },

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
