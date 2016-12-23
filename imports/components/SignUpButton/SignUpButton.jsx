import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Radium from 'radium';
import {propTypes} from 'react-router';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx'

class SignUpButton extends Component {

  login() { this.context.history.push('/login') }

  render() {
    return (
      <RaisedButton onClick={this.login.bind(this)}>
        {this.props.buttonText}
      </RaisedButton>
    )
  }

};

SignUpButton.contextTypes = {
  history: propTypes.historyContext
}

SignUpButton.propTypes = {
  /**
   * Replace the default text
   */
  buttonText: PropTypes.string
};

SignUpButton.defaultProps = {
  buttonText: 'Gaaf, meld me aan!'
};

export default Radium(SignUpButton);
