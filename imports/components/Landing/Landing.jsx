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

        <CommonBikeLogo style={s.logo} />

        <p style={s.introText}>
          Welkom bij het nieuwe fiets-deel-systeem van Nederland. Wij delen fietsen. Ons doel: overal en altijd een fiets voor iedereen.
        </p>

        <div style={s.bottomWrapper}>
          <p>
            <a style={s.smallText} href="http://commonbike.com" target="_blank">euhm, maar hoe werkt dat dan?</a>
          </p>

          <RaisedButton onClick={this.login}>
            Meld je aan voor de pilot
          </RaisedButton>
        </div>

      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '40px 20px 0 20px',
    background: '#00d0a2',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  logo: {
    height: '100px'
  },
  introText: {
    maxWidth: '320px',
    padding: '20px',
    margin: '0 auto',
    fontWeight: '500',
    fontSize: '1.45em',
    lineHeight: '1.3em',
  },
  smallText: {
    color: '#fff',
    fontSize: '0.8em',
    fontWeight: '500',
  }
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Landing);
