import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js'; 

// Import components
import LocationDetailsComponent from '../../components/LocationDetails/LocationDetails';

/**
 *  LocationDetails
 * 
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class LocationDetails extends Component {

  constructor(props) {
    super(props);

    if( ! Meteor.userId() ) FlowRouter.go('/login', {redirectTo: '/admin'});
  }

  /**
   *  newLocation
   * 
   * Adds a new location to the database having the title "Locatie-naam"
   */
  newLocation() { Meteor.call('locations.insert', {title: "Nieuwe locatie"}) }

  clickItemHandler(item) { FlowRouter.go('somewhere', {}) }

  render() {
    return (
      <LocationDetailsComponent isEditable="true" clickItemHandler={this.clickItemHandler} />
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

LocationDetails.propTypes = {
  locations: PropTypes.array,
  isEditable: PropTypes.any,
  onClickHandler: PropTypes.any,
};

export default createContainer((props) => {
  Meteor.subscribe('locations');
  return {
    currentUser: Meteor.user(),
  };
}, LocationDetails);
