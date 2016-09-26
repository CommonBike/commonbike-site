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
      <div style={Object.assign({}, s.base, {backgroundColor: this.props.lock.isAvailable ? '#316b21' : '#612b2b'})} onClick={this.claimLock.bind(this)}>
        <i className="fa fa-lock" style={{marginRight: '5px'}}></i> {this.props.lock.title}
      </div>
    );
  }
}

var s = {
  base: {
    background: '#316b21',
    color: '#fff',
    fontWeight: 'bold',
    padding: '15px 30px',
    margin: '10px 0',
    cursor: 'pointer'
  }
}

export default Lock;