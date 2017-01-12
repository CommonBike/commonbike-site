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
      <div style={Object.assign({}, s.base, {backgroundColor: this.props.backgroundColor})}>
        {this.props.children}
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    margin: '0 auto',
    width: '100%',
    minHeight: 'calc(100% - 66px)',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  logo: {
    height: '36px'
  },
}

CustomPage.propTypes = {
  children: PropTypes.any.isRequired,
  backgroundColor: PropTypes.string,
};

CustomPage.defaultProps = {
  backgroundColor: '#fff',
};

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, Radium(CustomPage));
