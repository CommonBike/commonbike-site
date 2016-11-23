import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import Radium, { StyleRoot } from 'radium';
import R from 'ramda';

// Import components
import CommonBikeLogo from '../CommonBikeLogo/CommonBikeLogo.jsx'
import RaisedButton from '../RaisedButton/RaisedButton.jsx'
import PageHeader from '../PageHeader/PageHeader.jsx'

class CustomPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={s.base}>

        <PageHeader />

        {this.props.children}

      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '0 20px 0 20px',
    background: '#fff',
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
    height: '36px'
  },
}

CustomPage.propTypes = {
  children: PropTypes.any.isRequired,
};

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Radium(CustomPage));
