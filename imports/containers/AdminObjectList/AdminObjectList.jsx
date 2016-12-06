import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Objects } from '/imports/api/locations.js'; 

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

    if( ! Meteor.userId() ) FlowRouter.go('/login', {redirectTo: '/admin'});
  }

  /**
   *  newObject
   * 
   * Adds a new location to the database having the title "Locatie-naam"
   */
  newObject() { Meteor.call('locations.insert', {title: "Nieuwe fiets"}) }

  clickItemHandler(item) { FlowRouter.go('somewhere', {}) }

  render() {
    return (
      <ObjectListComponent locations={this.props.locations} isEditable="true" clickItemHandler={self.clickItemHandler} />
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
  onClickHandler: PropTypes.any,
};

export default createContainer((props) => {
  return {
    currentUser: Meteor.user(),
  };
}, ObjectList);
