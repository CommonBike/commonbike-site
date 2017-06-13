import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

// Import templates
import LoginFormComponent from '/imports/client/components/LoginForm/LoginForm.jsx';

class LoginForm extends Component {

  constructor(props) {
    super(props);
  }

  //+ loginHandler :: Object -> void
  loginHandler(userCredentials) {
    let self = this;
    Meteor.loginWithPassword(userCredentials.username, userCredentials.password, function(err) {
      if(err) {
        alert(err.reason)
      } else {
        if (self.props.loginCallback) {
          self.props.loginCallback()
        }
      }
    });
  }

  openLink() {
    var link = "https://www.bikepassepartout.com";
    var win = window.open(link);
    win.focus();
  }


  //+ signUpHandler :: Object -> void
  signUpHandler(userCredentials) {
    Accounts.createUser({
      email: userCredentials.email,
      password: userCredentials.password
    }, function(err){
      if(err) {
        if(err.error == 403 && err.message != 'User validation failed [403]') {
          // goto
          msg = '{ Please register with bikepasspartout first }.';
          this.openlink();
        } else {
          let msg = err.reason;
        }

        alert(msg);
        console.log(err);
      }
    }.bind(this));

    if(this.props.callback) {
      this.props.callback()
    }
  }

  render() {
    return (
      <LoginFormComponent loginHandler={this.loginHandler.bind(this)} signUpHandler={this.signUpHandler.bind(this)} />
    )
  }

};

LoginForm.propTypes = {
  loginCallback: PropTypes.any // This function is executed after login
};

export default LoginForm;
