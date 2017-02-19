import React, { Component, PropTypes } from 'react';

// Import components
import PageHeader from '../PageHeader/PageHeader.jsx'
import FeedbackWidget from '../../containers/FeedbackWidget/FeedbackWidget.jsx';

// UserApp component - represents the whole app
export default class UserApp extends Component {

  render() {
    return (
      <div style={Object.assign({}, s.base, {background: this.props.background})}>
        {this.props.showPageHeader ? <PageHeader /> : null}
        {this.props.content}
        <FeedbackWidget />
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
    minHeight: '100%',
    overflow: 'auto',
    margin: '0 auto',
  },
}
