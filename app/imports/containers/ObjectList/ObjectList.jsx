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
};

ObjectList.defaultProps = {
  isEditable: false
}

export default createContainer((props) => {
  Meteor.subscribe('objects');

  var filter = {$or: [{'state.state': 'reserved'}, {'state.state': 'inuse'}], 'state.userId':Meteor.userId()};

  return {
  	title: "Bekijk hier jouw reserveringen",
    objects: Objects.find(filter, {sort: {title: 1}}).fetch()
  };
}, ObjectList);
