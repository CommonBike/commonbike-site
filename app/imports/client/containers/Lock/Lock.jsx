import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

// Import templates
import LockComponent from '/imports/client/components/Lock/Lock.jsx';

class Lock extends Component {
  
  constructor(props) {
    super(props);

    this.state = this.props.lock;
  }

  claimLock() {

    if(this.state.isAvailable) {
      document.location = '/checkin/'+this.props.lock.title;
    }

    this.setState({isAvailable: ! this.state.isAvailable});

    Meteor.call('locks.update', this.state._id, { title: this.state.title, isAvailable: ! this.state.isAvailable });

  }

  render() {
    return (
      <LockComponent lock={this.state} claimLock={this.claimLock.bind(this)} />
    );
  }
}

export default Lock;
