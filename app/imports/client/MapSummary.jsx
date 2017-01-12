import React, { Component, PropTypes } from 'react'
import Map from './Map'

class MapSummary extends Component {

  constructor(props) {
    super(props);

    this.state = {
     mapVisible: false
    }
  }

  toggleMap() {
    this.setState({
      mapVisible: !this.state.mapVisible
    })
  }

  renderMap(){
    return (
      <Map width={this.props.width} height={this.props.height} item={this.props.item} />
    )
  }

  render() {
    if (!this.props.item || !this.props.item.lat_lng) {
      return null
    }

    const from = ''
    const to = encodeURIComponent(this.props.item.address)
    const directionsUrl = `https://maps.google.com/maps/dir/${from}/${to}`

    return (
      <div>
        <div>
          {this.props.item.address}
          <a href='#!' onClick={this.toggleMap.bind(this)}>(map)</a>
          <a href={directionsUrl} target='_blank'>(directions)</a>
        </div>

        {this.state.mapVisible && this.renderMap()}
     </div>
    )
  }
}

MapSummary.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired
}

MapSummary.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight-32,
  item: {
    address: 'Moreelsepark 65, Utrecht, Netherlands',
    title: 'Seats2meet',
    description: 'Utrecht CS',
    lat_lng: [52.08906, 5.11343]
  }
}

export default MapSummary
