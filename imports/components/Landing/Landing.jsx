import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import CommonBikeLogo from '../CommonBikeLogo/CommonBikeLogo.jsx'
import RaisedButton from '../RaisedButton/RaisedButton.jsx';

class Landing extends Component {

  constructor(props) {
    super(props);

    this.state = { activeSlide: 0 }
  }

  login() { FlowRouter.go('login') }

  render() {
    return (
      <div style={s.base}>

        <CommonBikeLogo />

        <p>
          Welkom bij het nieuwe fiets-deel-systeem van Nederland. Wij delen fietsen. Ons doel: overal en altijd een fiets voor iedereen.
        </p>

        <p>
          <a style={s.smallText} href="https://commonbike.com" target="_blank">euhm, maar hoe werkt dat dan?</a>
        </p>

        <RaisedButton onClick={this.login}>
          Meld je aan voor de pilot
        </RaisedButton>

      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    background: '#00d0a2',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    textAlign: 'center'
  },
  smallText: {
    color: '#fff',
    fontSize: '0.8em'
  }
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Landing);
