import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

class CheckIn extends Component {
 
  constructor(props) {
    super(props)
  }

  done() {
    document.location = '/';
  }

  render() {
    return (
      <div style={s.base}>

        <h2>Dank voor het gebruik van CommonBike</h2>

        <p>U kunt nu kluis <b><u>{this.props.lockTitle}</u></b> openen.</p>

        <p>Is uw fiets gestald en zit de deur dicht? Druk dan op de volgende knop.</p>

        <button style={s.button} onClick={this.done.bind(this)}>Ik heb mijn fiets gestald</button>

      </div>
    );
  }
}

var s = {
  base: {
    marginTop: '15px',
    padding: '15px',
    background: '#316b21',
    color: '#fff',
    fontSize: 'default'
  },
  button: {
    fontSize: '1.2em',
    background: '#fff',
    color: '#000',
    fontWeight: 'bold',
    padding: '15px 30px',
    margin: '10px 0',
    cursor: 'pointer'
  }
}

export default CheckIn;
