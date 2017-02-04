import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js'; 
import { Objects, ObjectsSchema, createObject } from '/imports/api/objects.js'; 

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

  newObject(locationId) {
    data = createObject(locationId, '_ Mijn nieuwe fiets');
    Meteor.call('objects.insert', data)
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
    // for providers: show all items on this location
    filter = {locationId: props.locationId}
  } else {
    // for users: show all AVAILABLE items on this location
    filter = {locationId: props.locationId, 'state.state':'available'}
  }

  return {
    locationId: props.locationId,
    location: Locations.find({_id: props.locationId}).fetch()[0],
    objects: Objects.find(filter, {sort: {title: 1}}).fetch()
  };
}, LocationDetails);
