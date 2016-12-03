import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js'; 

// Import components
import ItemBlock from '../ItemBlock/ItemBlock'
import RaisedButton from '../RaisedButton/RaisedButton'

/**
 *  LocationList
 * 
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class LocationList extends Component {

  constructor(props) {
    super(props);

    if( ! Meteor.userId() ) FlowRouter.go('/login', {redirectTo: '/admin'});
  }

  /**
   *  newLocation
   * 
   * Adds a new location to the database having the title "Locatie-naam"
   */
  newLocation() {
    let data = {title: "Nieuwe locatie"};

    Meteor.call('locations.insert', data);
  }

  render() {
    self = this;
    return (
      <div style={s.base}>

        <div style={Object.assign({display: 'none'}, this.props.isEditable && {display: 'block'})}>

          <p style={s.paragraph}>
            Op deze pagina kun je de locaties beheren. Klik op <b>Nieuwe locatie</b> of <b><i>pas een titel aan</i></b>.
          </p>

          <RaisedButton onClick={this.newLocation.bind(this)}>Nieuwe locatie</RaisedButton>

        </div>

        {R.map((location) => <ItemBlock key={location._id} item={location} isEditable={self.props.isEditable} onClick={self.props.clickItemHandler} />, this.props.locations)}

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
  locations: PropTypes.array.isRequired,
  isEditable: PropTypes.any,
  clickItemHandler: PropTypes.any,
};

export default createContainer((props) => {
  Meteor.subscribe('locations');
  return {
    currentUser: Meteor.user(),
    locations: Locations.find({}, { sort: {_id: -1} }).fetch()
  };
}, LocationList);
