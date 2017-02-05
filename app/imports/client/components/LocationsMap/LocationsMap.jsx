import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';
import { Settings } from '/imports/api/settings.js'; 

import './Leaflet.EasyButton.js';

// Import models
import { Locations, Address2LatLng } from '/imports/api/locations.js'; 

class LocationsMapComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      map: undefined,
      watchId : undefined,
      trackingMarkersGroup: undefined,
      locationMarkersGroup: undefined,
      showParkingMarkers: false,
      parkingButton: undefined,
      parkingMarkersGroup: undefined
    }
  }

  componentDidMount() {
    var map = L.map('mapid');

    map.setView(this.props.startLocation, this.props.startZoom);

    map.on('moveend', this.mapChanged.bind(this));
    map.on('zoomend', this.mapChanged.bind(this));

    L.easyButton( '<img src="'+ s.images.hier + '" style="width:32px;height:32px" />', this.toggleTrackUser.bind(this) ).addTo(map);    

    var locationMarkersGroup = L.featureGroup().addTo(map);    
    locationMarkersGroup.on("click", function (event) {
      var clickedMarker = event.layer;
      this.context.history.push('/location/' + clickedMarker.locationId);
    }.bind(this));      

    var trackingMarkersGroup = L.featureGroup().addTo(map);   // no tracking marker yet!

    var parkingstates = {
      states: [
        {
          stateName: 'verborgen',
          icon: '<img src="' + s.images.veiligstallengrijs + '" style="width:32px;height:32px" />',
          title: 'toon stallingen',
          onClick: this.toggleParking.bind(this)
        },
        {
          stateName: 'zichtbaar',
          title: 'verberg stallingen',
          icon: '<img src="' + s.images.veiligstallen + '" style="width:32px;height:32px" />',
          onClick: this.toggleParking.bind(this)
        },         
      ]
    };

    // Button is not added to map yet: only when enabled
    var parkingButton = L.easyButton(parkingstates).state(this.state.showParkingMarkers ? 'zichtbaar' : 'verborgen');

    var parkingMarkersGroup = L.geoJSON(null , {pointToLayer: this.parkingPointToLayer.bind(this), filter: this.parkingFilterLayers.bind(this)} ).addTo(map);   // no tracking marker yet!

    this.setState(prevState => ({ map: map, 
                                  trackingMarkersGroup: trackingMarkersGroup,
                                  locationMarkersGroup: locationMarkersGroup,
                                  parkingButton: parkingButton,
                                  parkingMarkersGroup: parkingMarkersGroup}));    
  }

  initializeMap() {
    if(!this.props.settings) {
      return;
    }

    var settings = this.props.settings;

    // https://www.mapbox.com/api-documentation/#retrieve-a-static-map-image
    const url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
    // const url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

    L.tileLayer(url, {
      attribution: '<a href="http://mapbox.com">Mapbox</a> | <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 22,
      id: settings.mapbox.style,  // https://www.mapbox.com/studio/tilesets/
      accessToken: settings.mapbox.userId
    }).addTo(this.state.map);

  }

  initializeLocationsMarkers() {
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
        var marker = L.marker(location.lat_lng, {icon: commonbikeIcon, zIndexOffset: -1000});
        marker.locationId = location._id;
        // markers.push(marker); // .bindPopup(location.title)
        this.state.locationMarkersGroup.addLayer(marker);
      }
    }, this.props.locations);
    

    // var locationMarkersGroup = L.featureGroup(markers);    
    // locationMarkersGroup.on("click", function (event) {
    //     var clickedMarker = event.layer;
    //     this.context.history.push('/location/' + clickedMarker.locationId);
    // }.bind(this));      

    // return locationMarkersGroup;
  }

  mapChanged() {
    if(this.state.showParkingMarkers) {
      this.initializeParkingLayer();
    }
  }

  // ----------------------------------------------------------------------------
  // user location tracking related functions
  // ----------------------------------------------------------------------------
  trackSuccess(pos) {
    const {coords} = pos
    newLatLng = [coords.latitude, coords.longitude]

    var trackingMarkersGroup = this.state.trackingMarkersGroup;
    var marker = undefined;
    if(trackingMarkersGroup.getLayers().length==0) {
       // create a new tracking marker
      marker = L.circleMarker([0,0]);
      marker.zIndexOffset = 1000;
      marker.bindPopup("<b>You are here</b>");

      trackingMarkersGroup.addLayer(marker)
    } else {
      marker = trackingMarkersGroup.getLayers()[0];
    }

    marker.setLatLng(newLatLng);
    if(!this.state.map.getBounds().contains(newLatLng)) {
      this.state.map.setView(newLatLng);
    }

    // for now: tracking is switched off after obtaining a single valid location
    // TODO:implement a toggle button for continuous tracking later on
    navigator.geolocation.clearWatch(this.state.watchId);
    this.setState(prevState => ({ watchId: undefined}));
  }

  trackError(err) {
    // alert('ERROR(' + err.code + '): ' + err.message);
    console.warn('ERROR(' + err.code + '): ' + err.message)
  }

  toggleTrackUser() {
    if(this.state.watchId==undefined) {
      options = {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0
      }

      var newid = navigator.geolocation.watchPosition(this.trackSuccess.bind(this), this.trackError.bind(this), options)
      this.setState(prevState => ({ watchId: newid}));
    } else {
      navigator.geolocation.clearWatch(this.state.watchId);
      this.setState(prevState => ({ watchId: undefined}));
    }
  }

  // ----------------------------------------------------------------------------
  // parking related functions
  // ----------------------------------------------------------------------------
  clearParkingLayer() {
    if(!this.state.parkingMarkersGroup) {
      return;
    }

    this.state.parkingMarkersGroup.clearLayers();
  }

  initializeParkingLayer() {
    if(this.props.settings) {
      if(this.props.settings.veiligstallen.visible) {
        this.state.parkingButton.addTo(this.state.map);
      } else {
        this.state.parkingButton.removeFrom(this.state.map);
      }
    } 

    this.state.parkingMarkersGroup.clearLayers();

    if(!this.state.showParkingMarkers) {
      return;
    }

    omnivore.kml('/files/Veiligstallen/veiligstallen.kml', null, this.state.parkingMarkersGroup).addTo(this.state.map);
  } 

  toggleParking() {
    this.setState(prevState => ({ showParkingMarkers: !prevState.showParkingMarkers}))
    this.state.parkingButton.state(this.state.showParkingMarkers?'zichtbaar':'verborgen');

    this.initializeParkingLayer();
  }

  parkingFilterLayers(feature, layer) {
    var coords = feature.geometry.coordinates;
    var newLatLng = [coords[1], coords[0]]

    // only add visible items
    return (this.state.map.getBounds().contains(newLatLng));
  }

  parkingPointToLayer(feature, latlng) {
    var parkingIcon = new L.Icon({
         iconSize: [24, 24],
         iconAnchor: [24, 24],
         popupAnchor:  [1, -12],
         iconUrl: s.images.veiligstallen
    });    
    return L.marker(latlng, {icon: parkingIcon});
  }

  // ----------------------------------------------------------------------------
  // rendering
  // ----------------------------------------------------------------------------
  render() {
    if(this.state.map) {
      this.initializeMap();
      this.initializeLocationsMarkers();
      this.initializeParkingLayer();
    }

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
    veiligstallen: '/files/Veiligstallen/icon.png',
    veiligstallengrijs: '/files/Veiligstallen/icon-grijs.png',
    hier: 'https://cdn2.iconfinder.com/data/icons/mini-icon-set-map-location/91/Location_28-48.png'
  }
}

LocationsMapComponent.contextTypes = {
  history: propTypes.historyContext
}

LocationsMapComponent.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  locations: PropTypes.array,
  mapboxSettings: PropTypes.object,
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
  Meteor.subscribe('settings', false);

  var locations = Locations.find({}, { sort: {title: 1} }).fetch()
  var settings = Settings.findOne({});

  return {
    locations: locations,
    settings: settings
  };
}, LocationsMapComponent);
