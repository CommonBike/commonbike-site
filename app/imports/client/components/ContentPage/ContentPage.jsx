import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import Radium, { StyleRoot } from 'radium';
import R from 'ramda';

// Import components
import PageHeader from '../PageHeader/PageHeader.jsx'
import SignUpButton from '../SignUpButton/SignUpButton.jsx'

class ContentPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={s.base}>

        {this.props.children}

        <div style={s.bottomWrapper}>
          <SignUpButton />
        </div>

      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '20px 20px 0 20px',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logo: {
    height: '36px'
  },
}

ContentPage.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Radium(ContentPage);
