import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes, Link} from 'react-router';

// Import models
import { Locations } from '/imports/api/locations.js'; 

// Import components
import LocationBlock from '../../containers/LocationBlock/LocationBlock';
import RaisedButton from '../RaisedButton/RaisedButton';

/**
 *  LocationList
 * 
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class LocationList extends Component {

  constructor(props) {
    super(props);
  }

  /**
   *  newLocation
   * 
   * Adds a new location to the database having the title "Locatie-naam"
   */
   newLocation() {
     if(this.props.newLocationHandler) {
       this.props.newLocationHandler();
     }
   }

  renderAdminLinks() {
    if (location.pathname.startsWith('/admin/')) {
      return (
        <Link to='/locations'>Locations</Link>
      )
    } else {
      return (
        <Link to='/admin/locations'>Admin Locations</Link>
      )
    }
  }

  render() {
    self = this;
    return (
      <div style={s.base}>
        {Roles.userIsInRole(Meteor.userId(), 'admin') && this.renderAdminLinks()}
        <div style={Object.assign({display: 'none'}, this.props.isEditable && {display: 'block'})}>

          <p style={s.paragraph}>
            Op deze pagina kun je de locaties beheren. 
          </p>

          { self.props.canCreateLocations ?  
            <p style={s.paragraph}>Klik op <b>Nieuwe locatie</b> of <b><i>pas een titel aan</i></b>.</p>
            :
            <p style={s.paragraph}><b><i>pas een titel aan</i></b>.</p>
          }

          { self.props.canCreateLocations ?  
            <RaisedButton onClick={this.newLocation.bind(this)}>Nieuwe locatie</RaisedButton>
            :
            <div />
          }
        </div>

        {R.map((location) =>  <LocationBlock
                                key={location._id}
                                item={location}
                                isEditable={self.props.isEditable}
                                onClick={self.props.clickItemHandler} />
                              , this.props.locations)}

      </div>
    );
  }

}

var s = {
  base: {
    padding: '10px 20px',
    textAlign: 'center'
  },
  paragraph: {
    padding: '0 20px'
  }
}

LocationList.contextTypes = {
  history: propTypes.historyContext
}

LocationList.propTypes = {
  locations: PropTypes.array,
  isEditable: PropTypes.any,
  canCreateLocations: PropTypes.any,
  clickItemHandler: PropTypes.any,
  newLocationHandler: PropTypes.any,
};

LocationList.defaultProps = {
  canCreateLocations: false,
  isEditable: false
}

export default LocationList;
