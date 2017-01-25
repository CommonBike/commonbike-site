import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';

import './Leaflet.EasyButton.js';

// Import models
import { Locations, Address2LatLng } from '/imports/api/locations.js'; 

class LocationsMapComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      myWatchId : undefined,
      myLatLng : [0,0],
      myMap : undefined,
      myMarker : undefined
    }
  }

  trackSuccess(pos) {
    alert('tracksuccess' + newid);
    const {coords} = pos

    newLatLng = [coords.latitude, coords.longitude]

    this.state.myMarker.setLatLng(newLatLng);
    if(!this.state.myMap.getBounds().contains(this.state.myMarker.getLatLng())) {
      var latlng = this.state.myMarker.getLatLng();
      this.state.myMap.setView(newLatLng);
    }

    // for now: tracking is switched off after obtaining a single valid location
    // TODO:implement a toggle button for continuous tracking later on
    navigator.geolocation.clearWatch(this.state.myWatchId);
    this.setState(prevState => ({ myWatchId: undefined}));
  }

  trackError() {
    alert('trackerror' + newid);
    console.warn('ERROR(' + err.code + '): ' + err.message)
  }

  toggleTrackUser() {
    if(this.state.myWatchId==undefined) {
      options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }

      var newid = navigator.geolocation.watchPosition(this.trackSuccess.bind(this), this.trackError.bind(this), options)
      this.setState(prevState => ({ myWatchId: newid}));
    } else {
      navigator.geolocation.clearWatch(this.state.myWatchId);
      this.setState(prevState => ({ myWatchId: undefined}));
    }
  }

  componentDidMount() {
    // create the map component
    const defaultStyle = "mapbox.streets" // mapbox.streets, mapbox.mapbox-streets-v7, mapbox.mapbox-terrain-v2, mapbox.satellite, mapbox.dark
    const defaultAccessToken = "pk.eyJ1IjoiZXJpY3ZycCIsImEiOiJjaWhraHE5ajIwNmRqdGpqN2h2ZXhqMnRsIn0.1FBWllDyQ_nSlHFE2jMLDA" // ericvrp Mapbox
    const {style = defaultStyle, accessToken = defaultAccessToken} = Meteor.settings.public.mapbox || {}

    map = L.map('mapid'); // .setView(item.lat_lng, 17)
    map.setView(this.props.startLocation, this.props.startZoom);

    // map.addControl(new LeafletCustomButton(map, {clickhandler: this.toggleTrackUser.bind(this),
    //                                                  iconurl: s.images.details}));
    L.easyButton( '<span class="star">&starf;</span>', this.toggleTrackUser.bind(this) ).addTo(map);    

    // https://www.mapbox.com/api-documentation/#retrieve-a-static-map-image
    const url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
    // const url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

    L.tileLayer(url, {
      attribution: '<a href="http://mapbox.com">Mapbox</a> | <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 22,
      id: style,  // https://www.mapbox.com/studio/tilesets/
      accessToken: accessToken
    }).addTo(map);

    trackingMarker = L.circleMarker(myLatLng).addTo(map)
    trackingMarker.bindPopup("<b>You are here</b>")

    this.setState(prevState => ({ myMap: map, myMarker: trackingMarker}));

    R.map((location) =>  {
    }, this.props.locations);
  }

  updateLocationsLayerGroup() {
 // create custom icon
    var commonbikeIcon = L.icon({
        iconUrl: '/favicon/commonbike.png',
        iconSize: [32, 32], // size of the icon
        });

    var markers = [];
    R.map((location) =>  {
      if(!location.lat_lng&&location.address) {
        var ll = Address2LatLng(location.address);
        location.lat_lng= ll;
      }

      if(location.lat_lng) {
        var marker = L.marker(location.lat_lng, {icon: commonbikeIcon});
        marker.locationId = location._id;
        markers.push(marker); // .bindPopup(location.title)
      }
    }, this.props.locations);

    var locationsFeatureGroup = L.featureGroup(markers);    
    locationsFeatureGroup.on("click", function (event) {
        var clickedMarker = event.layer;
        this.context.history.push('/location/' + clickedMarker.locationId);
    }.bind(this));      

    return locationsFeatureGroup;
  }

  render() {
    if(this.state.myMap) {
      var group = this.updateLocationsLayerGroup();
      group.addTo(this.state.myMap);
    }

    //                 <a onClick={ this.toggleTrackUser.bind(this) }><img src={ s.images.details } style={s.icon} alt="toggle"/></a>
    return (
        <div id='mapid' style={Object.assign({}, s.base, {width: this.props.width, height: this.props.height, maxWidth: '100%'})}>
        </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    background: '#e0e0e0'
  },
  images: {
    details: 'https://cdn1.iconfinder.com/data/icons/general-9/500/more-48.png',
  }
}

LocationsMapComponent.contextTypes = {
  history: propTypes.historyContext
}

LocationsMapComponent.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  locations: PropTypes.array,
  clickItemHandler: PropTypes.any,
  startLocation: PropTypes.array,
  startZoom: PropTypes.number
};

LocationsMapComponent.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight-78,
  clickItemHandler: '',
  startLocation: [52.159685, 4.490405],
  startZoom: 13
}

export default LocationsMap = createContainer((props) => {
  Meteor.subscribe('locations', false);

  var locations = Locations.find({}, { sort: {title: 1} }).fetch()

  return {
    locations: locations
  };
}, LocationsMapComponent);
