import React, { Component, PropTypes } from 'react'

import L from 'leaflet'
import {Map as LeafletMap, TileLayer, Marker, Popup} from 'react-leaflet'
import ReactMapboxGl, { Layer as ReactMapboxLayer, Feature as ReactMapboxFeature, Marker as ReactMapboxMarker} from 'react-mapbox-gl'
import Geosearch from './Geosearch'

// mapType providers
const mapTypes = ['leaflet', 'react-leaflet', 'react-mapbox-gl'] // , 'mapbox', 'mapboxgl', 'google maps']

class Map extends Component {
  constructor(props) {
    super(props)

    // const london = [51.505, -0.09]
    // const utrecht = [52.0893191, 5.110169099999999]
    this.state = {
      mapType: mapTypes[0],
      position: undefined
    }

    Geosearch(this.props.address).then(json => {
      const location = json.results[0].geometry.location
      const position = [location.lat, location.lng]
      // console.log(position)
      this.setState({'position': position})
    })

    // console.log(this.state)
  }

  _renderLeaflet() {
    // console.log('_renderLeaflet')

    const {style, accessToken} = Meteor.settings.public.mapbox
    // console.log(style)
    // console.log(accessToken)

    // console.log(this.state.position)
    var mymap = L.map('mapid').setView(this.state.position, 17);
  
    // const url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
    const url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

    L.tileLayer(url, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 20,
      id: style,
      accessToken: accessToken
    }).addTo(mymap);
  }

  renderLeaflet() {
    // console.log('renderLeaflet')

    // const address = this.props.address
    // console.log('mapType', this.state.mapType, 'for', address)

    return (
      <div>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.2/dist/leaflet.css" />
        <div id='mapid' style={{height: 512}}></div>
        {this.state.position && $('#mapid').length && this._renderLeaflet()}
      </div>
    )
  }

  renderReactLeaflet() {
    return (
      <LeafletMap center={this.state.position} zoom={13}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
        <Marker position={this.state.position}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </LeafletMap>
    )
  }

  renderReactMapboxGL() {
    const {style, accessToken} = Meteor.settings.public.mapbox
    // console.log(style)
    // console.log(accessToken)

    return (
      <ReactMapboxGl
        style={style}
        accessToken={accessToken}
        position={this.state.position}
      />
      )
  }

  render() {
    // console.log(this.state.mapType)

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
  address: PropTypes.string.isRequired
}

Map.defaultProps = {
  address: 'Utrecht, Netherlands'
}

export default Map
