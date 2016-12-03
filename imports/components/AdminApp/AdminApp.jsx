import React, { Component, PropTypes } from 'react';

// AdminApp component - represents the whole app
export default class AdminApp extends Component {

  render() {
    return (
      <div style={Object.assign({}, s.base, {background: this.props.background})}>
        {this.props.content}
      </div>
    );
  }

}

AdminApp.propTypes = {
  background: PropTypes.string,
};

AdminApp.defaultProps = {
  background: '#fbae17',
}

var s = {
  base: {
    maxWidth: '100%',
    minHeight: '100%',
    margin: '0 auto'
  },
}
