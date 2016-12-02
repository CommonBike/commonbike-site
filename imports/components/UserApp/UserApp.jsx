import React, { Component, PropTypes } from 'react';

// Import components
import PageHeader from '../PageHeader/PageHeader.jsx'

// UserApp component - represents the whole app
export default class UserApp extends Component {

  render() {
    return (
      <div style={Object.assign({}, s.base, {background: this.props.background})}>
        {this.props.showPageHeader ? 
          <div style={{padding: '40px 20px 0 20px'}}>
            <PageHeader />
          </div> : null}
        {this.props.content}
      </div>
    );
  }

}

UserApp.propTypes = {
  background: PropTypes.string,
  showPageHeader: PropTypes.bool,
};

UserApp.defaultProps = {
  background: '#fbae17',
  showPageHeader: true,
}

var s = {
  base: {
    maxWidth: '100%',
    height: '100%',
    minHeight: '100%',
    overflow: 'auto',
    margin: '0 auto'
  },
}
