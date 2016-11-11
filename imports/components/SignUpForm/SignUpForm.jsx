import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Radium from 'radium';

// Import components
import TextField from '../TextField/TextField.jsx';
import RaisedButton from '../RaisedButton/RaisedButton.jsx';

class SignUpForm extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  handleChange(e) {
    tmp = [];
    tmp[$(e.target).attr('name')] = $(e.target).val();
    this.setState(tmp);
  };

  submitForm(e) {
    e.preventDefault();

    this.props.signUpHandler({
      email: this.state.email,
      password: this.state.password
    });
  }

  render() {
    return (
      <form onSubmit={this.submitForm.bind(this)} method="post">

        <div style={s.label}>Email address</div>
        <TextField type="email" name="email" style={s.textField} handleChange={this.handleChange.bind(this)} />
        
        <div style={s.label}>Password</div>
        <TextField type="password" name="password" style={s.textField} handleChange={this.handleChange.bind(this)} />

        <RaisedButton label="Sign Up" type="submit" style={s.button} />

      </form>
    )
  }

};

var s = {
  label: {
    display: 'none',
  },
  textField: {
    display: 'inline-block',
    width: '300px',
    maxWidth: '100%',
  },
  button: {
    marginTop: '5px',
    marginBottom: '5px',
    width: '300px',
    maxWidth: '100%'
  }
}

SignUpForm.propTypes = {
  signUpHandler: PropTypes.any.isRequired
};

export default Radium(SignUpForm);
