import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Settings } from '/imports/api/settings.js';
import { Locations } from '/imports/api/locations.js';
import { Objects } from '/imports/api/objects.js';

// Import components
import LocationsList from '/imports/client/components/LocationsList/LocationsList';
import LocationsMap from '/imports/client/components/LocationsMap/LocationsMap';

/**
 *  LocationList
 *
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class LocationList extends Component {

  constructor(props) {
    super(props);

    this.state = { mapBoundaries: null }
  }

  /**
   *  newLocationHandler
   *
   * Adds a new location to the database having the title "_Een nieuwe locatie"
   */
  newLocationHandler() {
    var locationName = prompt('Wat is de naam van de nieuwe locatie?');

    if(locationName){
      Meteor.call('locations.insert', {
        title: locationName,
        imageUrl: '/files/IconsButtons/Location-26-512.png' // https://cdn2.iconfinder.com/data/icons/location-3/128/Location-26-512.png
      }, this.newLocationAdded.bind(this));
    }
  }

  newLocationAdded(error, result) {
    // Re-subscribe is necessary: otherwise the location does not show up
    // in the provider's location list without a full page reload (there is no
    // subscription relation with the user table that maintains the list
    // of managed locations per user)
    Meteor.subscribe('locations', this.props.isEditable);

    alert('De locatie is toegevoegd aan de lijst.');
  }

  /*
    getVisibleObjectsOnly :: ? -> ?

    Get only the objects inside the maps boundaries.
  */
  getVisibleObjectsOnly(object) {

    // Every object needs a lat/lng
    if( ! object.lat_lng)
      return false;

    // If mapBoundaries is not set: exclude this object
    if( ! this.state.mapBoundaries)
      return false;

    // Every object needs to be visible inside the map boundaries
    // #TODO: Should work below the equator as well
    let b = this.state.mapBoundaries, o = object, visibleOnMap = false;
    visibleOnMap = b._southWest.lat <= o.lat_lng[0] && b._northEast.lat >= o.lat_lng[0] // (check if object lies between latitude 'west' & latitude 'east')
    visibleOnMap = visibleOnMap && b._northEast.lng >= o.lat_lng[1] && b._southWest.lng <= o.lat_lng[1] // (check if object lies between longitude 'north' & longitude 'south')

    return visibleOnMap;
  }

  // mapChange :: Object { _northEast: {lat: Float, lng: Float}, _southWest: {lat: Float, lng: Float} } -> void
  mapChanged(boundaries) {
    // Check input
    check(boundaries, L.LatLngBounds)
    // Set new state
    this.setState({ mapBoundaries: boundaries })
  }

  getMap(locations) {
    if(!this.props.isEditable) {
      return (
        <LocationsMap locations={locations}
                        objects={this.props.objects}
                        settings={this.props.settings}
                        mapChanged={this.mapChanged.bind(this)}
                        />
      );
    } else {
      return (<div />);
    }
  }

  render() {
    if(!this.props.isEditable) {
      locations = R.filter(this.getVisibleObjectsOnly.bind(this), this.props.locations)
    } else {
      locations = this.props.locations
    }

    return (
      <div>
       { this.getMap(locations)}
       <LocationsList locations={locations}
                        isEditable={this.props.isEditable}
                        newLocationHandler={this.newLocationHandler.bind(this)}
                        canCreateLocations={this.props.canCreateLocations} />
      </div>
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
  Meteor.subscribe('objects', false);
  Meteor.subscribe('settings', false);

  var user=Meteor.user();
  var canCreateLocations = false;
  if(user&&user.profile&&user.profile.cancreatelocations) {
    canCreateLocations = user.profile.cancreatelocations
  }

  return {
    currentUser: Meteor.user(),
    locations: Locations.find({}, { sort: {title: 1} }).fetch(),
    objects: Objects.find({}, { sort: {title: 1} }).fetch(),
    settings: Settings.findOne({}),
    canCreateLocations: canCreateLocations
  };
}, LocationList);
