import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Radium from 'radium';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx'

class SignUpButton extends Component {

  render() {
    return (
      <RaisedButton onClick={this.login}>
        {this.props.buttonText}
      </RaisedButton>
    )
  }

};

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
