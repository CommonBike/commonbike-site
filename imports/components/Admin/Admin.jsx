import React, { Component } from 'react';

// AdminApp component - represents the whole app
export default class AdminApp extends Component {

  render() {
    return (
      <div style={s.base}>
        {this.props.content}
      </div>
    );
  }

}

var s = {
  base: {
    textAlign: 'center',
    background: '#fbae17',
    maxWidth: '100%',
    height: '100%',
    margin: '0 auto'
  },
}
