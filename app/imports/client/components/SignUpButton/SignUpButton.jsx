import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Radium from 'radium';
import { RedirectTo } from '/client/main'

// Import components
import RaisedButton from '../Button/RaisedButton.jsx'

class SignUpButton extends Component {

  login() { RedirectTo('/login') }

  render() {
    return (
      <RaisedButton onClick={this.login.bind(this)}>
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
