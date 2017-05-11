import React, { Component, PropTypes } from 'react';
import { Accounts } from 'meteor/accounts-base';

// Import templates
import SignUpFormComponent from '/imports/client/components/SignUpForm/SignUpForm.jsx';

class SignUpForm extends Component {

  constructor(props) {
    super(props);
  }

  //+ signUpHandler :: Object -> void
  signUpHandler(userCredentials) {
    Accounts.createUser({
      email: userCredentials.email,
      password: userCredentials.password
    }, function(err){
      if(err) {
        let msg = err.reason;
        if(err.error == 403) msg += ' Great that you did join CommonBike! You will receive an email notification soon.';

        alert(msg);
        console.log(err);
      }
    });
    if(this.props.callback) {
      this.props.callback()
    }
  }

  render() {
    return (
      <SignUpFormComponent signUpHandler={this.signUpHandler.bind(this)} />
    )
  }

};

SignUpForm.propTypes = {
  callback: PropTypes.any // This function is executed after login
};

export default SignUpForm;
