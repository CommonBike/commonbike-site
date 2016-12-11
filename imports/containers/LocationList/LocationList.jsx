import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js'; 

// Import components
import LocationListComponent from '../../components/LocationList/LocationList';

/**
 *  LocationList
 * 
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class LocationList extends Component {

  constructor(props) {
    super(props);

    if( ! Meteor.userId() ) FlowRouter.go('/login', {redirectTo: '/admin'});
  }

  /**
   *  newLocation
   * 
   * Adds a new location to the database having the title "Locatie-naam"
   */
  newLocation() {
    Meteor.call('locations.insert', {
      title: "Nieuwe locatie",
      imageUrl: 'https://cdn2.iconfinder.com/data/icons/location-3/128/Location-26-512.png'
    });
  }

  render() {
    return (
      <LocationListComponent locations={this.props.locations} isEditable={this.props.isEditable} />
    );
  }

}

var s = {
  base: {
    padding: '10px 20px'
  },
  paragraph: {
    padding: '0 20px'
  }
}

LocationList.propTypes = {
  locations: PropTypes.array,
  isEditable: PropTypes.any
};

LocationList.defaultProps = {
  isEditable: false
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user(),
  };
}, LocationList);
