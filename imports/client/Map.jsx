import React, { Component, PropTypes } from 'react'
import L from 'leaflet'

// import Geosearch from './Geosearch'
// Geosearch(this.props.address).then(json => {
//   const location = json.results[0].geometry.location
//   // const position = [location.lat, location.lng]
//   const position = [28.572184,34.5348787] // Blue Hole, Dahab
//   // console.log(position)
//   this.setState({'position': position})
// })

class Map extends Component {
  componentDidMount() {
    const {item} = this.props
    const {style, accessToken} = Meteor.settings.public.mapbox

    const mymap = L.map('mapid').setView(item.lat_lng, 17)
  
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

    const marker = L.marker(item.lat_lng, {icon: myIcon}).addTo(mymap)
    marker.bindPopup(`<b>${item.title}</b><br>${item.address}`).openPopup()
  }

  render() {
    const address = encodeURIComponent(this.props.item.address)
    const mapsUri = `https://maps.google.com/maps?q=${address}`
    // const mapsUri = `geo:0,0?q=${address}`

    return (
      <div>
        <div id='mapid' style={{height: window.innerHeight-100}}></div>
        <a href={mapsUri} target='_blank'>Map</a>
      </div>
    )
  }
}

Map.propTypes = {
  item: PropTypes.object.isRequired
}

Map.defaultProps = {
  item: {
    address: 'Moreelsepark 65, Utrecht, Netherlands',
    title: 'Seats2meet',
    description: 'Utrecht CS',
    lat_lng: [52.08906, 5.11343]
  }
}

export default Map
