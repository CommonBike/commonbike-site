import React, { Component, PropTypes } from 'react';
import R from 'ramda';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx'

class LocationDetails extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={s.base}>
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '20px 20px 0 20px'
  },
}

LocationDetails.propTypes = {
  // children: PropTypes.any,
};

export default LocationDetails;
