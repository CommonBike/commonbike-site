import React, { Component } from 'react';

import PageHeader from '../PageHeader/PageHeader.jsx';
 
// App component - represents the whole app
export default class App extends Component {

  render() {
    return (
      <div style={s.base}>
        <PageHeader />
        {this.props.content}
      </div>
    );
  }

}

var s = {
  base: {
    maxWidth: '100%',
    height: '100%',
    margin: '0 auto'
  },
}
