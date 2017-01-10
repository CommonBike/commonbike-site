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
        isEditable={this.props.isEditable} />
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
  isRentalMode: PropTypes.any
};

ObjectList.defaultProps = {
  isEditable: false,
  isRentalMode: false
}

export default createContainer((props) => {
  Meteor.subscribe('objects');

  var filter=null;
  var title="";
  if(!props.isRentalMode) {
    title = 'Bekijk hier jouw reserveringen';
    filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}], 'state.userId':Meteor.userId()};
  } else {
    title = 'Verhuurstatus';
    filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}]};
  }

  return {
  	title: title,
    objects: Objects.find(filter, {sort: {title: 1}}).fetch()
  };
}, ObjectList);
