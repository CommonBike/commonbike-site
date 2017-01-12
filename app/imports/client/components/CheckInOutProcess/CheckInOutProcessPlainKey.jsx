import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
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

  checkCode() {
    if(ReactDOM.findDOMNode(this.refs.code).value != '25')
      return alert('Dat is niet de juiste code. Probeer het opnieuw.');

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
          <p style={s.explanationText}>
            Uw fiets ophalen? Druk op de knop <b>HUUR</b> voor een huurcode.
            Let op: uw huurperiode start op het moment dat de huurcode is afgegeven!
          </p>
          <Button style={s.button} onClick={() => this.setObjectInUse() } buttonStyle="huge">HUUR</Button>
          <Button style={s.button} onClick={() => this.setObjectAvailable() }>annuleren</Button>
        </div>
        : <div /> }
      {this.props.object.state.state=='inuse' ? 
           this.state.showCodeEntry ? 
              <div style={s.base}>
                <ul style={s.list}>
                  <li style={s.listitem}>Zet s.v.p. <b>{this.props.object.title}</b> afgesloten weg en lever de sleutel in bij de medewerker.<br /><br /></li>
                  <li style={s.listitem}>Vraag om de <b>locatiecode</b> en vul deze hieronder in om de huurperiode te beëindigen.<br /><br /></li>
                  <li style={s.listitem}><TextField required="required" type="code" ref="code" placeholder="locatiecode" name="code" style={s.textfield}/></li>
                  <li style={s.listitem}><Button style={s.button} onClick={() => this.checkCode() }>CODE INVOEREN</Button></li>
                </ul>
              </div>
            : 
              <div style={s.base}>
                <ul style={s.list}>
                  <li style={s.listitem}>Toon onderstaande huurcode aan de medewerker en vraag om de sleutel.</li>
                  <CheckInCode title="HUURCODE" code={this.props.object.lock.settings.keyid} />
                  <li style={s.listitem}>Hiermee kunt u <b>{this.props.object.title}</b> openen.</li>
                </ul>
                <Button style={s.button} onClick={() => this.setState(prevState => ({ showCodeEntry: ! prevState.showCodeEntry})) }>TERUGBRENGEN</Button> 
              </div>
          
          : <div /> }
      {this.props.object.state.state=='outoforder' ? 
          <Button style={s.button} onClick={() => this.setObjectAvailable() }>Maak beschikbaar!</Button> 
        : <div /> }
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    margin: '10px 0',
    textAlign: 'center',
  },

  button: {
    display: 'block'
  },

  list: {
    margin: '0 auto',
    padding: 0,
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

  explanationText: {
    padding: '0 25px 25px 25px',
    margin: '0px auto',
    maxWidth: '400px',
    textAlign: 'left',
    minHeight: '80px',
    fontSize: '1.2em',
    fontWeight: 500,
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
