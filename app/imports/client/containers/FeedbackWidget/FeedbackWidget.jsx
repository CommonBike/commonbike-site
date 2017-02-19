import React, { Component, PropTypes } from 'react';
import { Accounts } from 'meteor/accounts-base';

// Import templates
import FeedbackWidgetComponent from '/imports/client/components/FeedbackWidget/FeedbackWidget.jsx';

class FeedbackWidget extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FeedbackWidgetComponent />
    )
  }

}

FeedbackWidget.propTypes = {
}

export default FeedbackWidget;
