import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import { Accounts } from 'meteor/accounts-base';

class FeedbackWidget extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <a style={s.base} ref="base">
        Feedback!
      </a>
    )
  }

}

var s = {
  base: {
    paddingTop: '1px',
    paddingRight: '5px',
    paddingBottom: '1px',
    paddingLeft: '5px',
    display: 'inline-block',
    color: '#000',
    width: '100px',
    fontSize: '11px',
    width: '32px',
    height: '32px',
    textAlign: 'center',
    textIndent: '-9999px',
    textDecoration: 'none',
    background: 'url(https://cdn2.iconfinder.com/data/icons/bitsies/128/Message-128.png) center center / contain no-repeat',
    position: 'fixed',
    right: '10px',
    bottom: '10px'
  }
}

FeedbackWidget.propTypes = {
}

export default Radium(FeedbackWidget);
