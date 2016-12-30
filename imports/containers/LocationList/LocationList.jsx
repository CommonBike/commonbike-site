import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';

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

    if( ! Meteor.userId() ) this.context.history.push('/login', {redirectTo: '/admin'});
  }

  /**
   *  newLocationHandler
   * 
   * Adds a new location to the database having the title "_Een nieuwe locatie"
   */
  newLocationHandler() {
    Meteor.call('locations.insert', {
      title: "_ Mijn nieuwe locatie",
      imageUrl: 'https://cdn2.iconfinder.com/data/icons/location-3/128/Location-26-512.png'
    }, this.newLocationAdded.bind(this));
  }

  newLocationAdded(error, result) {
    // re-subscribe is necessary: otherwise the location does not show up
    // in the provider's location list without a full page reload (there is no 
    // subscription relation with the user table that maintains the list
    // of managed locations per user)
    Meteor.subscribe('locations', this.props.isEditable);
  }

  render() {
    return (
      <LocationListComponent locations={this.props.locations} 
                             isEditable={this.props.isEditable} 
                             newLocationHandler={this.newLocationHandler.bind(this)} />
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
  isEditable: PropTypes.any,
  newLocation: PropTypes.any,
//  locHandle:  PropTypes.any
};

LocationList.defaultProps = {
  isEditable: false,
  newLocation: null
  //locHandle: null
}

export default createContainer((props) => {
  Meteor.subscribe('locations', props.isEditable)

  return {
    currentUser: Meteor.user(),
    locations: Locations.find({}, { sort: {title: 1} }).fetch(),
  };
}, LocationList);
