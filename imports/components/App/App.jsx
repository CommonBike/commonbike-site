import React, { Component } from 'react';
 
// App component - represents the whole app
export default class App extends Component {
 
  render() {
    return (
      <div>
        {this.props.content}
      </div>
    );
  }
}
