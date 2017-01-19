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

    var length = 5;
    var base = Math.pow(10, length+1);
    var code = Math.floor(base + Math.random() * base)
    // console.log('code: ' + code);
    keycode = code.toString().substring(1, length+1);

    Meteor.call('objects.insert', {
      locationId: locationId,
      title: "_ Mijn nieuwe fiets",
      imageUrl: '/files/Block/bike.png',
      state: {state: 'available',
              userId: null,
              timestamp: timestamp},
      lock: {type: 'plainkey',
             settings: {keyid: keycode }
            }
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
    // for providers: show all items on this location
    filter = {locationId: props.locationId}
  } else {
    // for users: show all AVAILABLE items on this location
    filter = {locationId: props.locationId, 'state.state':'available'}
  }

  return {
    currentUser: Meteor.user(),
    locationId: props.locationId,
    location: Locations.find({_id: props.locationId}).fetch()[0],
    objects: Objects.find(filter, {sort: {title: 1}}).fetch()
  };
}, LocationDetails);
