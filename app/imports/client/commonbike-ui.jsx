import React, { Component, PropTypes } from 'react';

// Import components
import AccountsUIWrapper from '/imports/client/containers/AccountsUIWrapper/AccountsUIWrapper.jsx';
import BackButton from '/imports/client/components/Button/BackButton.jsx';
import Block from '/imports/client/components/Block/Block.jsx';
import Button from '/imports/client/components/Button/Button.jsx';
import RaisedButton from '/imports/client/components/Button/RaisedButton.jsx';
import Hr from '/imports/client/components/Hr/Hr.jsx';
import Avatar from '/imports/client/components/Avatar/Avatar.jsx';
import CheckInCode from '/imports/client/components/CheckInCode/CheckInCode.jsx';
import LoginForm from '/imports/client/components/LoginForm/LoginForm.jsx';
import MapSummary from '/imports/client/MapSummary.jsx'

class CommonBikeUI extends Component {

  onTestGoAbout() {
    Meteor.call('goabout.testservice', (error, result) => {
      console.log(error || result)
    })
  }

  onTestVelocity() {
    Meteor.call('velocity.checkuser', 'M@h1.nl', (error, result) => {
      console.log(error || result)
    })

    Meteor.call('velocity.checkuser', 'mosbuma@bumos.nl', (error, result) => {
      console.log(error || result)
    })
  }

  onTestSoap() {
    Meteor.call('testsoap', (error, result) => {
      console.log(error || result)
    })
  }

  render() {
    return (
      <div style={s.base}>
        <h2>Velocity Onboarding</h2>
        <RaisedButton onClick={this.onTestVelocity}>Test Velocity Onboarding</RaisedButton>

        <h2>GoAbout</h2>
        <RaisedButton onClick={this.onTestGoAbout}>Test GoAbout API</RaisedButton>

        <h2>Button</h2>
        <Button>Klik hier! ~ Button</Button>

        <Hr />

        <h2>BackButton</h2>
        <div style={{background: '#000'}}>
          <BackButton />
        </div>

        <h2>RaisedButton</h2>

        <RaisedButton>Klik hier! ~ RaisedButton</RaisedButton>

        <h2>Basic UI component</h2>
        <AccountsUIWrapper />

        <Hr />

        <h2>Avatar</h2>
        <Avatar />

        <Hr />

        <h2>CheckInCode</h2>
        <CheckInCode />

        <h2>LoginForm</h2>
        <LoginForm />

        <h2>MapSummary</h2>
        <MapSummary width={600} height={400} />

        <h2>Soap</h2>
        <RaisedButton onClick={this.onTestSoap}>Test</RaisedButton>
      </div>
    );
  }
}

s = {
  base: {
    padding: '40px 20px 0 20px',
    background: '#eee',
    minHeight: '100%',
  }
}

export default CommonBikeUI;
