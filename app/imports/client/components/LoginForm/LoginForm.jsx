import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import Radium from 'radium';
import Future from 'fluture';

// Import components
import TextField from '../TextField/TextField.jsx';
import RaisedButton from '../Button/RaisedButton.jsx';
import Button from '../Button/Button';

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.state = { user: false }
  }

  setUser(error, users) { 
    if(!error && (users.length >0)) {
      this.setState({ user: users[0]});
    }
  }

  handleChange(e) {
    var email = $(e.target).val();
    if(email.includes('@')) {
      Meteor.call('login.finduser', $(e.target).val(), this.setUser.bind(this));
    }
  };

  // submitForm :: Event -> void
  submitForm(e) {
    e.preventDefault();

    // Function that gets the value of an input field referenced by ref="name"
    const val = name => ReactDOM.findDOMNode(this.refs[name]).value;

    // If there's an account with this email address already:
    if(this.state.user) {
      // Login
      this.props.loginHandler({
        username: val('email'),
        password: val('password')
      });
    }

    // If no account was found with this email adress:
    else{
      // SignUp
      this.props.signUpHandler({
        email: val('email'),
        password: val('password'),
        password2: val('password2')
      });
    }
  }

  render() {
    return (
      <form style={s.base} onSubmit={this.submitForm.bind(this)} method="post">

        <div style={s.label}>E-mailadres</div>
        <TextField type="email" ref="email" placeholder="Je e-mailadres" name="email" style={s.textField} onChange={this.handleChange.bind(this)} />

        <div style={s.label}>Wachtwoord</div>
        <TextField type="password" ref="password" placeholder="Vul een uniek wachtwoord in" name="password" style={s.textField} />

        <div style={Object.assign({display: 'block', maxWidth: '100%'}, this.state.user && {display: 'none'})}>
          <div style={s.label}>Herhaal je wachtwoord</div>
          <TextField type="password" ref="password2" placeholder="Herhaal je wachtwoord" name="password2" style={s.textField} />
        </div>

        <Button style={s.button} type='submit'>Meld me aan</Button>

      </form>
    )
  }

};

var s = {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
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

LoginForm.propTypes = {
  loginHandler: PropTypes.any.isRequired,
  signUpHandler: PropTypes.any.isRequired
};

export default createContainer((props) => {
  return {}
}, LoginForm);
