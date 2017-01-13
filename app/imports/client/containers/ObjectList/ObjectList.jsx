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
  isEditable: PropTypes.any,
  emptyListMessage: PropTypes.string
};

ObjectList.defaultProps = {
  isEditable: false
}

export default createContainer((props) => {
  Meteor.subscribe('objects');
  Meteor.subscribe('users');
  
  var filter=null;
  var title="";
  if(!props.isEditable) {
    title = 'Bekijk hier jouw reserveringen';
    filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}], 'state.userId':Meteor.userId()};
    emptyListMessage = 'GEEN RESERVERINGEN'
  } else {
    title = 'Jouw verhuurde fietsen';

    // only show objects for which the current loggedin user is one of the providers
    console.log(Meteor.user());

    var mylocations = [];
    if(Meteor.user()) {
      mylocations = Meteor.user().profile.provider_locations||[];
    }

    console.log(mylocations)

    filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}], locationId: { $in: mylocations }};
    emptyListMessage = 'ER ZIJN GEEN FIETSEN VERHUURD'
  }

  return {
  	title: title,
    objects: Objects.find(filter, {sort: {title: 1}}).fetch(),
    emptyListMessage: emptyListMessage
  };
}, ObjectList);
