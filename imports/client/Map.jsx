import React, { Component, PropTypes } from 'react'

import L from 'leaflet'
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet'
import ReactMapboxGl, { Layer as ReactMapboxLayer, Feature as ReactMapboxFeature, Marker as ReactMapboxMarker} from 'react-mapbox-gl'
// import Geosearch from './Geosearch'

const mapTypes = ['leaflet', 'react-leaflet', 'react-mapbox-gl'] // , 'mapbox', 'mapboxgl', 'google maps']

class Map extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mapType: mapTypes[0],
      // position: undefined
    }

    // Geosearch(this.props.address).then(json => {
    //   const location = json.results[0].geometry.location
    //   // const position = [location.lat, location.lng]
    //   const position = [28.572184,34.5348787] // Blue Hole, Dahab
    //   // console.log(position)
    //   this.setState({'position': position})
    // })

    // console.log(this.props)
  }

  componentDidMount() {
    const {location} = this.props
    const {style, accessToken} = Meteor.settings.public.mapbox

    const mymap = L.map('mapid').setView(location.lat_lng, 17)
  
    // const url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
    const url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

    L.tileLayer(url, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      id: style,
      accessToken: accessToken
    }).addTo(mymap)

    const myIcon = L.icon({
        iconUrl: '/files/LocationDetails/marker.svg',
        iconSize: [32, 32],
        iconAnchor: [15, 25],
        popupAnchor: [8, -16],
        // iconUrl: 'my-icon.png',
        // iconRetinaUrl: 'my-icon@2x.png',
        // iconSize: [38, 95],
        // iconAnchor: [22, 94],
        // popupAnchor: [-3, -76],
        // shadowUrl: 'my-icon-shadow.png',
        // shadowRetinaUrl: 'my-icon-shadow@2x.png',
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
    })

    const marker = L.marker(location.lat_lng, {icon: myIcon}).addTo(mymap)
    marker.bindPopup(`<b>${location.title}</b><br>${location.address}`).openPopup()
  }

  renderLeaflet() {
    return (
      <div id='mapid' style={{height: 512}}></div>
    )
  }

  renderReactLeaflet() {
    const {location} = this.props

    return (
      <LeafletMap center={location.lat_lng} zoom={13}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
        <Marker position={location.lat_lng}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </LeafletMap>
    )
  }

  renderReactMapboxGL() {
    const {location} = this.props
    const {style, accessToken} = Meteor.settings.public.mapbox
    // console.log(style)
    // console.log(accessToken)

    return (
      <ReactMapboxGl
        style={style}
        accessToken={accessToken}
        position={location.lat_lng}
      />
      )
  }

  render() {
    switch (this.state.mapType) {
      case 'leaflet':
        return this.renderLeaflet()

      case 'react-leaflet':
        return this.renderReactLeaflet()

      case 'react-mapbox-gl':
        return this.renderReactMapboxGL()
    }

    console.error('Unknown mapType', this.state.mapType)
    return (
      <div>Unknown mapType {this.state.mapType}</div>
    )
  }
}

Map.propTypes = {
  location: PropTypes.object.isRequired
}

Map.defaultProps = {
  location: {
    address: 'Moreelsepark 65, Utrecht, Netherlands',
    title: 'Seats2meet',
    description: 'Utrecht CS',
    lat_lng: [52.08906, 5.11343]
  }
}

export default Map
