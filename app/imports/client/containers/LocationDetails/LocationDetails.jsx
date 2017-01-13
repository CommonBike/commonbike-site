import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js'; 
import { Objects } from '/imports/api/objects.js'; 

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
  }

  /**
   *  newObject
   * 
   * Adds a new object to the database having the title "_Een nieuwe fiets"
   */
  newObject(locationId) { 
    var timestamp =  new Date().valueOf();
    Meteor.call('objects.insert', {
      locationId: locationId,
      title: "_ Mijn nieuwe fiets",
      imageUrl: '/files/Block/bike.png',
      state: {state: 'available',
              userId: null,
              timestamp: timestamp}
    })
  }

  render() {
    return (
      <LocationDetailsComponent
        locationId={this.props.locationId}

        location={this.props.location}
        objects={this.props.objects}
        clickItemHandler={this.props.clickItemHandler}
        newObject={() => this.newObject(this.props.locationId)}
        isEditable={this.props.isEditable} />
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

LocationDetails.defaultProps = {
  isEditable: false
}

export default createContainer((props) => {
  Meteor.subscribe('locations', props.isEditable)
  Meteor.subscribe('objects');

  var filter = null;
  if(props.isEditable) {
    filter = {locationId: props.locationId}
  } else {
    filter = {locationId: props.locationId, $or: [{'state.state':'available'}, {'state.userId': Meteor.userId()}]}
  }

  return {
    currentUser: Meteor.user(),
    locationId: props.locationId,
    location: Locations.find({_id: props.locationId}).fetch()[0],
    objects: Objects.find(filter, {sort: {title: 1}}).fetch()
  };
}, LocationDetails);
