import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { RedirectTo } from '/client/main'
import { Settings } from '/imports/api/settings.js';
import L from 'leaflet'
import 'leaflet-search'

import './Leaflet.EasyButton.js';

import { LocationsFiltered, Address2LatLng } from '/imports/api/locations.js';
import { Objects } from '/imports/api/objects.js';

class LocationsMapComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: undefined,
      watchId : undefined,
      trackingMarkersGroup: undefined,
      locationMarkersGroup: undefined,
      objectMarkersGroup: undefined,
      showParkingMarkers: false,
      parkingButton: undefined,
      parkingMarkersGroup: undefined
    }
  }

  formatJSON(rawjson) {
    let json = {}, key, loc, disp = [];

    for(var i in rawjson) {
      key = rawjson[i].formatted_address;
      loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );
      json[key] = loc;// key,value format
    }

    return json;
  }

  componentDidMount() {
    // Init map
    let map = L.map('mapid', {
      zoomControl: true// Hide zoom buttons
    });

    // Start geocoding
    let geocoder = new google.maps.Geocoder();
    let googleGeocoding = (text, callResponse) => geocoder.geocode({address: text}, callResponse);

    // Now add the search control
    map.addControl( new L.Control.Search({
      position: 'topleft',
      sourceData: googleGeocoding,
      formatData: this.formatJSON,
      markerLocation: true,
      autoType: false,
      autoCollapse: true,
      minLength: 2
    }) );

    // Add a leyer for search elements
    let markersLayer = new L.LayerGroup();
    map.addLayer(markersLayer);

    map.setView(this.props.startLocation, this.props.startZoom);

    map.on('moveend', this.mapChanged.bind(this));
    map.on('zoomend', this.mapChanged.bind(this));

    this.props.mapChanged ? this.props.mapChanged(map.getBounds()) : null

    // Now set the map view
    map.setView(this.props.startLocation, this.props.startZoom);

    // Le easy button
    L.easyButton( '<img src="'+ s.images.hier + '" style="width:22px;height:22px" />', this.toggleTrackUser.bind(this) ).addTo(map);

    var locationMarkersGroup = L.featureGroup().addTo(map);
    locationMarkersGroup.on("click", function (event) {
      var clickedMarker = event.layer;
      RedirectTo('/location/' + clickedMarker.locationId);
    }.bind(this));

    var objectMarkersGroup = L.featureGroup().addTo(map);
    objectMarkersGroup.on("click", function (event) {
        var clickedMarker = event.layer;
        RedirectTo('/bike/details/' + clickedMarker.bikeLocationId);
    }.bind(this));

    var trackingMarkersGroup = L.featureGroup().addTo(map);   // no tracking marker yet!
    this.toggleTrackUser()

    // var parkingstates = {
    //   states: [
    //     {
    //       stateName: 'verborgen',
    //       icon: '<img src="'+ s.images.veiligstallengrijs + '" style="width:32px;height:32px" />',
    //       title: 'toon stallingen',
    //       onClick: this.toggleParking.bind(this)
    //     },
    //     {
    //       stateName: 'zichtbaar',
    //       title: 'verberg stallingen',
    //       icon: '<img src="'+ s.images.veiligstallen + '" style="width:32px;height:32px" />',
    //       onClick: this.toggleParking.bind(this)
    //     },
    //   ]
    // };
    //
    // // Button is not added to map yet: only when enabled
    // var parkingButton = L.easyButton(parkingstates).state(
    //   this.state.showParkingMarkers ? 'zichtbaar' : 'verborgen'
    // );

    // var parkingMarkersGroup = L.geoJSON(null , {
    //   pointToLayer: this.parkingPointToLayer.bind(this), filter: this.parkingFilterLayers.bind(this)
    // }).addTo(map); // no tracking marker yet!

    this.setState(prevState => ({ map: map,
                                  trackingMarkersGroup: trackingMarkersGroup,
                                  locationMarkersGroup: locationMarkersGroup,
                                  objectMarkersGroup: objectMarkersGroup,
                                }));
                                // parkingButton: parkingButton,
                                // parkingMarkersGroup: parkingMarkersGroup

    setTimeout(this.mapChanged,1000);
  }

  initializeMap() {
    if ( ! this.props.settings)
      return;

    var settings = this.props.settings;

    if (settings.mapbox.userId.startsWith('<')) {
      console.warn(settings.mapbox.userId)
      return
    }

    // https://www.mapbox.com/api-documentation/#retrieve-a-static-map-image
    // const url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    const url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'

    L.tileLayer(url, {
      attribution: '<a href="http://mapbox.com">Mapbox</a> | <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 22,
      id: settings.mapbox.style,  // https://www.mapbox.com/studio/tilesets/
      accessToken: settings.mapbox.userId
    }).addTo(this.state.map);

  }

  initializeLocationsMarkers() {
    var markers = [];

    this.state.locationMarkersGroup.clearLayers();

    R.map((location) =>  {
      if(!location.lat_lng&&location.address) {
        var ll = Address2LatLng(location.address);
        location.lat_lng= ll;
      }

      if(location.lat_lng) {
        // create custom icon
        let imageUrl;
        if(location.imageUrl&&location.imageUrl!='') {
          imageUrl = location.imageUrl;
        } else {
          imageUrl = '/files/LocationDetails/location.png'
        }
        var commonbikeIcon = L.icon({
          iconUrl: imageUrl,
          iconSize: [32, 32], // size of the icon
        });

        var marker = L.marker([location.lat_lng[0],location.lat_lng[1]] , {icon: commonbikeIcon, zIndexOffset: -1000}); // locationMarker
        marker.locationId = location._id;
        // markers.push(marker); // .bindPopup(location.title)
        try {
          this.state.locationMarkersGroup.addLayer(marker);
        } catch(ex) {
          console.error(ex);
          console.log('error for location ' + location.title + '/' + location.imageUrl)
          console.log(JSON.stringify(location,0,2));
        }
      } else {
        console.log('not lat_lng for ' + location.title)
      }
    }, this.props.locations);

    // var locationMarkersGroup = L.featureGroup(markers);
    // locationMarkersGroup.on("click", function (event) {
    //     var clickedMarker = event.layer;
    //     RedirectTo('/location/' + clickedMarker.locationId);
    // }.bind(this));
  }

  initializeObjectsMarkers() {
  // create custom icon
    var bikeIcon = L.icon({
        iconUrl: '/files/ObjectDetails/marker.svg',
        iconSize: [16, 16], // size of the icon
        });

    var markers = [];
    R.map((object) => {
      if(object.lat_lng) {
        var marker = L.marker(object.lat_lng, {icon: bikeIcon, zIndexOffset: -900}); // bike object marker
        marker.bikeLocationId = object._id;
        // markers.push(marker); // .bindPopup(location.title)
        this.state.objectMarkersGroup.addLayer(marker);
      }
    }, this.props.objects);
  }

  mapChanged(e) {
    // Send changed trigger to parent
    if(!this.state) return;
    if(!this.state.map) return;

    this.props.mapChanged ? this.props.mapChanged(this.state.map.getBounds()) : null

    // Show parking markers if the app demands it
    // if(this.state.showParkingMarkers) {
    //   this.initializeParkingLayer();
    // }
  }

  // ----------------------------------------------------------------------------
  // user location tracking related functions
  // ----------------------------------------------------------------------------
  trackSuccess(pos) {
    console.log('trackSuccess');

    const {coords} = pos
    newLatLng = [coords.latitude, coords.longitude]

    var trackingMarkersGroup = this.state.trackingMarkersGroup;
    var marker = undefined;

    if (trackingMarkersGroup.getLayers().length==0) {
       // create a new tracking marker
      marker = L.circleMarker([0,0]);
      marker.zIndexOffset = -800; // use marker/tracking
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
  // clearParkingLayer() {
  //   if(!this.state.parkingMarkersGroup) {
  //     return;
  //   }
  //
  //   this.state.parkingMarkersGroup.clearLayers();
  // }
  //
  // initializeParkingLayer() {
  //   if(this.props.settings) {
  //     if(this.props.settings.veiligstallen.visible) {
  //       this.state.parkingButton.addTo(this.state.map);
  //     }
  //   }
  //
  //   this.state.parkingMarkersGroup.clearLayers();
  //
  //   if( ! this.state.showParkingMarkers) {
  //     return;
  //   }
  //
  // omnivore.kml('/files/ProviderLogos/Veiligstallen/veiligstallen.kml', null, this.state.parkingMarkersGroup).addTo(this.state.map);
  // }
  //
  // toggleParking() {
  //   this.setState(prevState => ({ showParkingMarkers: !prevState.showParkingMarkers}))
  //   this.state.parkingButton.state(this.state.showParkingMarkers?'zichtbaar':'verborgen');
  //   this.initializeParkingLayer();
  // }
  //
  // parkingFilterLayers(feature, layer) {
  //   var coords = feature.geometry.coordinates;
  //   var newLatLng = [coords[1], coords[0]]
  //
  //   // only add visible items
  //   return (this.state.map.getBounds().contains(newLatLng));
  // }
  //
  // parkingPointToLayer(feature, latlng) {
  //   var parkingIcon = new L.Icon({
  //        iconSize: [24, 24],
  //        iconAnchor: [24, 24],
  //        popupAnchor:  [1, -12],
  //        iconUrl: s.images.veiligstallen
  //   });
  //   return L.marker(latlng, {icon: parkingIcon});
  // }

  // ----------------------------------------------------------------------------
  // rendering
  // ----------------------------------------------------------------------------
  render() {
    if(this.state.map) {
      this.initializeMap();
      this.initializeLocationsMarkers();
      this.initializeObjectsMarkers();
      // this.initializeParkingLayer();
    }

    return (
      <div id='mapid' style={Object.assign({}, s.base, {width: this.props.width, height: this.props.height, maxWidth: '100%'})}>
        { Meteor.userId() ? <a style={s.avatar} onClick={() => RedirectTo('/profile')}><Avatar /></a> : <a style={s.avatar} onClick={() => RedirectTo('/login')}><Avatar /></a> }
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    background: '#e0e0e0',
    textAlign: 'right'
  },
  avatar: {
    display: 'inline-block',
    position: 'relative',
    zIndex: 2000,
    margin: '15px 20px'
  },
  images: {
    veiligstallen: '/files/ProviderLogos/Veiligstallen/icon.png',
    veiligstallengrijs: '/files/ProviderLogos/Veiligstallen/icon-grijs.png',
    hier: '/files/IconsButtons/compass-black.svg' // 'https://einheri.nl/assets/img/home_files/compass-black.svg'
  },
  searchForLocation: {
    position: 'relative',
    zIndex: 90000,
    display: 'block',
    width: 'calc(100vw - 40px)',
    margin: '20px auto',
    borderRadius: 0,
    border: 'none',
    height: '50px',
    lineHeight: '50px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)'
  }
}

LocationsMapComponent.propTypes = {
  width: PropTypes.any,
  height: PropTypes.any,
  locations: PropTypes.array,
  objects: PropTypes.array,
  mapboxSettings: PropTypes.object,
  mapChanged: PropTypes.func,
  clickItemHandler: PropTypes.any,
  startLocation: PropTypes.array,
  startZoom: PropTypes.number
};

LocationsMapComponent.defaultProps = {
  width: '100vw',
  height: '50vh',
  clickItemHandler: '',
//  startLocation: [52.159685, 4.490405], // Leiden
  startLocation: [51.842122, 5.859506],   // Nijmegen
  startZoom: 15
}

export default LocationsMap = createContainer((props) => {
  return {
    locations: props.locations,
    objects: props.objects,
    settings: props.settings
  };
}, LocationsMapComponent);
