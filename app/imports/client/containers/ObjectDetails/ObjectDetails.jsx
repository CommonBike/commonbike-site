import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Import models
import { Locations } from '/imports/api/locations.js'; 
import { Objects } from '/imports/api/objects.js'; 

// Import components
import ObjectDetailsComponent from '../../components/ObjectDetails/ObjectDetails';

/**
 *  ObjectDetails
 * 
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class ObjectDetails extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ObjectDetailsComponent
        currentUser={this.props.currentUser}
        location={this.props.location}
        object={this.props.object}
        checkedIn={this.props.checkedIn}
        isEditable={this.props.isEditable} />
    );
  }

}

// Define what propTypes are allowed
ObjectDetails.propTypes = {
  isEditable: PropTypes.any,
  locations: PropTypes.array,
  onClickHandler: PropTypes.any
};

// Set default prop values
ObjectDetails.defaultProps = {
  isEditable: false,
  object: {},
  location: {}
}

export default createContainer((props) => {

  // Subscribe to models
  Meteor.subscribe('locations', props.isEditable);
  Meteor.subscribe('objects');

  // Get object (bike) information
  let object = Objects.find({_id: props.objectId}).fetch()[0];

  // Return variables for use in this component
  return {
    currentUser: Meteor.user(),
    object: object,
    location: object ? Locations.find({_id: object.locationId}).fetch()[0] : {}
  };

}, ObjectDetails);
