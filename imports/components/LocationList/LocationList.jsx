import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js'; 

// Import components
import Block from '../Block/Block';
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

    if( ! Meteor.userId() ) FlowRouter.go('/login', {redirectTo: '/admin'});
  }

  /**
   *  newLocation
   * 
   * Adds a new location to the database having the title "Locatie-naam"
   */
  newLocation() {
    Meteor.call('locations.insert', {title: "Nieuwe locatie"});
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

        {R.map((location) => <Block key={location._id} item={location} isEditable={self.props.isEditable} onClick={self.props.clickItemHandler} />, this.props.locations)}

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

LocationList.propTypes = {
  locations: PropTypes.array,
  isEditable: PropTypes.any,
  clickItemHandler: PropTypes.any,
};

export default createContainer((props) => {
  return {
    currentUser: Meteor.user(),
    locations: Locations.find({}, { sort: {title: 1} }).fetch()
  };
}, LocationList);
