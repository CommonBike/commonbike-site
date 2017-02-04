import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

// Import models
import { Locks } from '/imports/api/locks.js';

// Import templates
import Lock from '/imports/client/containers/Lock/Lock.jsx';

class LockOverview extends Component {

  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault();
 
    // Insert new lock
    Meteor.call('locks.insert', {
      title: ReactDOM.findDOMNode(this.refs.textInput).value.trim(),
      isAvailable: true
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  // renderLocks :: void -> [Lock]
  renderLocks() {
    return this.props.locks.map(lock => <Lock key={lock._id} lock={lock} />)
  }
 
  render() {
    return (
      <div>
        <p>
          Kies hieronder jouw gewenste kluis.
        </p>
        <form onSubmit={this.handleSubmit.bind(this)} hidden="hidden">
          <input type="text" ref="textInput" placeholder="To add a lock, enter the lock (e.g. Zeist 2)" />
        </form>
        {this.renderLocks()}
      </div>
    );
  }
}

LockOverview.propTypes = {
  locks: PropTypes.array.isRequired
};

export default createContainer((props) => {
  return {
    locks: Locks.find({}).fetch()
  }
}, LockOverview);
