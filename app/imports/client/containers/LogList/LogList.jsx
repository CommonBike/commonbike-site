import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Log } from '/imports/api/log.js'; 

// Import components
import LogListComponent from '../../components/LogList/LogList';

/**
 *  LogList
 * 
 * @param {Object} locations
 * @param {Boolean} isEditable
 */
class LogList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LogListComponent title={this.props.title} logitems={this.props.logitems} />
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

LogList.propTypes = {
  logitems: PropTypes.array,
};

LogList.defaultProps = {
}

export default createContainer((props) => {
  Meteor.subscribe('log');

  return {
  	title: 'Log',
    logitems: Log.find({}, {sort: { timestamp:-1}, limit:10}).fetch()
  };
}, LogList);
