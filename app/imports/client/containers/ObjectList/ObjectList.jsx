import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js'; 
import { Objects } from '/imports/api/objects.js'; 

// Import components
import ObjectListComponent from '../../components/ObjectList/ObjectList';

/**
 *  ObjectList
 * 
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class ObjectList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ObjectListComponent
      	title={this.props.title}
        objects={this.props.objects}
        clickItemHandler=""
        isEditable={this.props.isEditable} 
        showPrice={this.props.showPrice}
        showState={this.props.showState}
        showRentalDetails={this.props.showRentalDetails}
        showLockDetails={this.props.showLockDetails}
        emptyListMessage={this.props.emptyListMessage}/>
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

ObjectList.propTypes = {
  objects: PropTypes.array,
  showPrice : PropTypes.any,
  showState : PropTypes.any,
  showRentalDetails: PropTypes.any,
  showLockDetails: PropTypes.any,
  isEditable: PropTypes.any,
  emptyListMessage: PropTypes.string
};

ObjectList.defaultProps = {
  showPrice : false,
  showState : false,
  showRentalDetails: false,
  showLockDetails: false,
  isEditable: false,

  rentalsMode: false
}

export default createContainer((props) => {
  Meteor.subscribe('objects');
  Meteor.subscribe('users');
  
  var filter=null;
  var title="";
  if(!props.rentalsMode) {
    title = 'Bekijk hier jouw reserveringen';

    // user can see his/her own reserved/rented bikes
    filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}], 'state.userId':Meteor.userId()};

    emptyListMessage = 'GEEN RESERVERINGEN'
  } else {
    title = 'Jouw verhuurde fietsen';

    // Only show objects for which the current loggedin user is one of the providers
    var mylocations = [];
    if(Meteor.user()) {
      mylocations = Meteor.user().profile.provider_locations||[];
    }

    filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}]};

    if( ! Roles.userIsInRole(Meteor.userId(), ['admin']) )
      filter.locationId = { $in: mylocations }

    emptyListMessage = 'ER ZIJN GEEN FIETSEN VERHUURD'
  }

  return {
  	title: title,
    objects: Objects.find(filter, {sort: {title: 1}}).fetch(),
    showPrice: props.showPrice||false,
    showState : props.showState||false,
    showRentalDetails: props.showRentalDetails||false,
    showLockDetails: props.showLockDetails||false,
    emptyListMessage: emptyListMessage
  };
}, ObjectList);
