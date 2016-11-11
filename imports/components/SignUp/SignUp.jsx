import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import AccountsUIWrapper from '/imports/containers/AccountsUIWrapper/AccountsUIWrapper.jsx';
import ReactSwipe from 'react-swipe';
import R from 'ramda';

// Necessary for material-ui
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Import templates
import RaisedButton from 'material-ui/RaisedButton';
import SquareButton from '../SquareButton/SquareButton.jsx';
import SocialShare from '../SocialShare/SocialShare.jsx';
import SignUpForm from '../../containers/SignUpForm/SignUpForm.jsx';

class Login extends Component {

  /**
   *  APP DASHBOARDS
   * 
   * Facebook: https://console.developers.google.com/apis/credentials?highlightClient=347856876516-if94srm24tciclpid7keqibf02p4dctn.apps.googleusercontent.com&project=commonbike-149108
   * Google: https://console.developers.google.com/apis/credentials?highlightClient=347856876516-if94srm24tciclpid7keqibf02p4dctn.apps.googleusercontent.com&project=commonbike-149108
   * GitHub: https://github.com/settings/applications/437650
   */

  constructor(props) {
    super(props);

    this.state = { activeSlide: 0 }

    // Needed for onTouchTap for material-ui buttons
    // http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin();
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  onError(err) {
    if( ! err) return;
    console.log(err);
    alert(err.message);
  }

  logout() { Meteor.logout() }

  // @bartwr READ LATER: https://themeteorchef.com/recipes/roll-your-own-authentication/
  loginWithGoogle() { Meteor.loginWithGoogle({ requestPermissions: ['email'] }, this.onError) }
  loginWithGithub() { Meteor.loginWithGithub({ requestPermissions: ['email'] }), this.onError }
  loginWithTwitter() { Meteor.loginWithTwitter() }
  loginWithFacebook() { Meteor.loginWithFacebook({ requestPermissions: ['email'] }, this.onError) }

  renderIntro() {
    return (
      <div>

        <p>
          Do you want to be the first that can test the app?
        </p>

        <p>
          <b>Log in with your favorite account</b>
        </p>

        <div style={s.socialButtonsWrapper}>
          <SquareButton src="google" size="64" title="Login with Google" onClick={this.loginWithGoogle.bind(this)} style={s.google} />
          <SquareButton src="github" size="64" title="Login with Github" onClick={this.loginWithGithub.bind(this)} style={s.github} />
          <SquareButton src="twitter" size="64" title="Login with Twitter" onClick={this.loginWithTwitter.bind(this)} style={s.twitter} />
          <SquareButton src="facebook" size="64" title="Login with Facebook" onClick={this.loginWithFacebook.bind(this)} style={s.facebook} />
        </div>

        <b>Or sign up using your email</b>

        <div style={{textAlign: 'center'}}>
          <SignUpForm />
        </div>

      </div>
    )
  }

  renderTeaser() {
    return (
      <div>
        <p>Leuk dat je meedoet! We sturen je als eerste een bericht als de app gebruikt kan worden.</p>
        <p>In november starten we een pilot in Leiden. Daarna breiden we uit.</p>
        <p><button onClick={this.logout()}>Log out</button></p>
      </div>
    )
  }

  render() {
    // <RaisedButton label="Aanmelden" primary={true} style={s.signUpButton} />
    // <RaisedButton label="Inloggen" secondary={true} style={s.signUpButton} />
    return (
      <div style={s.base}>

        {this.props.currentUser ? this.renderTeaser() : this.renderIntro()}

      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    color: '#000',
  },
  signUpButton: {
    margin: '10px 0',
  },
  socialButtonsWrapper: {
    display: 'flex',
    justifyContent: 'space-around'
  }
}

Login.childContextTypes = {
  muiTheme: PropTypes.object
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Login);
