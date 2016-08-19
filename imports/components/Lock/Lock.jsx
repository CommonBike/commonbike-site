import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Lock extends Component {
 
  constructor(props) {
    super(props);
  }

  claimLock() {
    this.props.claimLock();
  }

  render() {
    return (
      <div style={Object.assign({}, s.base, {color: this.props.lock.isAvailable ? 'green' : 'red'})} onClick={this.claimLock.bind(this)}>
        {this.props.lock.title}
      </div>
    );
  }
}

var s = {
  base: {
    border: 'solid #000 1px',
    padding: '10px'
  }
}

export default Lock;