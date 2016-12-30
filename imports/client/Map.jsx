import React, { Component, PropTypes } from 'react'
import L from 'leaflet'

class Map extends Component {
  componentDidMount() {
    const {item} = this.props
    const defaultStyle = "mapbox.streets" // mapbox.streets, mapbox.mapbox-streets-v7, mapbox.mapbox-terrain-v2, mapbox.satellite, mapbox.dark
    const defaultAccessToken = "pk.eyJ1IjoiZXJpY3ZycCIsImEiOiJjaWhraHE5ajIwNmRqdGpqN2h2ZXhqMnRsIn0.1FBWllDyQ_nSlHFE2jMLDA" // ericvrp Mapbox
    const {style = defaultStyle, accessToken = defaultAccessToken} = Meteor.settings.public.mapbox || {}

    const mymap = L.map('mapid').setView(item.lat_lng, 17)
  
    // https://www.mapbox.com/api-documentation/#retrieve-a-static-map-image
    const url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
    // const url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

    L.tileLayer(url, {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      // maxZoom: 20,
      id: style,  // https://www.mapbox.com/studio/tilesets/
      accessToken: accessToken
    }).addTo(mymap)

    const useCustomMarkerIcon = false
    let   marker

    if (useCustomMarkerIcon) {
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
      marker = L.marker(item.lat_lng, {icon: myIcon}).addTo(mymap)
    } else { // !useCustomMarkerIcon
      marker = L.marker(item.lat_lng).addTo(mymap)
    }
    
    marker.bindPopup(`<b>${item.title}</b><br>${item.address}`).openPopup()
  }

  render() {
    const from = ''
    const to = encodeURIComponent(this.props.item.address)
    const mapsUri = `https://maps.google.com/maps/dir/${from}/${to}`

    return (
      <div>
        <div id='mapid' style={{width: this.props.width, height: this.props.height}}></div>
        <a href={mapsUri} target='_blank'>Directions</a>
      </div>
    )
  }
}

Map.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired
}

Map.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight-32,
  item: {
    address: 'Moreelsepark 65, Utrecht, Netherlands',
    title: 'Seats2meet',
    description: 'Utrecht CS',
    lat_lng: [52.08906, 5.11343]
  }
}

export default Map
