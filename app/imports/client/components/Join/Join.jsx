import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import Radium, { StyleRoot } from 'radium';
import R from 'ramda';

import SignUpButton from '../SignUpButton/SignUpButton.jsx';
import Hr from '../Hr/Hr.jsx';

class Join extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.flex).style.display = 'flex';
  }

  render() {
    return (
      <div style={s.base}>

        <h1>CommonBike: Waar wil je fietsen?</h1>

        <p>
          Een fiets pakken en inleveren waar jij wilt. Hoe tof is dat? Kies waar je wilt fietsen en open het slot met je smartphone. Binnenkort gaan we weer live. Samen breiden we dan snel uit.
        </p>

        <p>
          ~ Fiets mee<br />
          ~ Bouw mee<br />
          ~ Beslis mee!
        </p>

        <SignUpButton />

        <h2>Hoe werkt het?</h2>

        <p>
          Overal een fiets pakken met één account. Bike sharing van en voor ons allemaal. Aanmelden is gratis. Je krijgt de sleutel van de stalling medewerker of je opent het slot met je phone.
        </p>

        <h2>Open source?</h2>

        <p>
          CommonBike is open source. Het is van ons allemaal. Vandaar de naam 'CommonBike'. Help mee, want vele handen maken licht werk. En wat is er toffer dan je eigen bike sharing te gebruiken? Lees hoe je kunt meehelpen en meebeslissen.
        </p>

        <h2>Doe mee!</h2>

        <p>
          Communiceren doen we vooral via <a href="http://slack.common.bike/" target="_blank">CommonBike op Slack</a>. De source code van de mobiele app, website en sloten staat op <a href="https://github.com/commonbike" target="_blank">github.com/CommonBike</a>. Wil je enkel op hoogte gehouden worden van de hoogtepunten, meld je dan aan voor <a href="http://commonbike.com/about/" target="_blank">de nieuwsbrief</a>.
        </p>

        <div ref="flex" style={{width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: '120px'}}>
          <a style={{display: 'flex', flex: 1}} href="http://slack.common.bike/" target="_blank">
            <img style={{height: '30px', display: 'block'}} src="https://forger.typo3.org/images/slack.svg" alt="Slack" />
          </a>
          <a style={{display: 'flex', flex: 1}} href="https://github.com/commonbike" target="_blank">
            <img style={{height: '30px', display: 'block'}} src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Octicons-logo-github.svg" alt="Github" />
          </a>
          <a style={{display: 'flex', flex: 1, alignItems: 'justifyContent'}} href="http://commonbike.com/about/" target="_blank">
            <img style={{height: '30px', display: 'block'}} src="https://static.mailchimp.com/web/brand-assets/logo-freddie-fullcolor.svg" alt="newsletter (MailChimp)" />
          </a>
        </div>

        <Hr />

        <p>
          <b>Nog veel meer informatie over het concept vind je op de website: <a href="http://commonbike.com/" target="_blank">commonbike.com</a></b>
        </p>

      </div>
    );
  }
}

var s = {
  base: {
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'left',
  },
}

Join.propTypes = {
};

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Radium(Join));
