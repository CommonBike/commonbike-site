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
   * Adds a new object to the database having the title "Nieuwe fiets"
   */
  newObject(locationId) { Meteor.call('objects.insert', {
    locationId: locationId,
    title: "Nieuwe fiets",
    imageUrl: '/files/Block/bike.png'
  })}

  render() {
    return (
      <LocationDetailsComponent
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
  Meteor.subscribe('locations');
  Meteor.subscribe('objects');
  return {
    currentUser: Meteor.user(),
    location: Locations.find({_id: props.locationId}).fetch()[0],
    objects: Objects.find({locationId: props.locationId}, {sort: {title: 1}}).fetch()
  };
}, LocationDetails);
