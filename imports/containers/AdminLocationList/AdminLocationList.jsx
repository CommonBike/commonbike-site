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
    let data = {title: "Nieuwe locatie"};

    Meteor.call('locations.insert', data);
  }

  clickItemHandler(item) {
    FlowRouter.go('somewhere', {})
  }

  render() {
    return (
      <LocationListComponent isEditable="true" clickItemHandler={self.clickItemHandler} />
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
  locations: PropTypes.array.isRequired,
  isEditable: PropTypes.any,
  onClickHandler: PropTypes.any,
};

export default createContainer((props) => {
  Meteor.subscribe('locations');
  return {
    currentUser: Meteor.user(),
    locations: Locations.find({}, { sort: {_id: -1} }).fetch()
  };
}, LocationList);
