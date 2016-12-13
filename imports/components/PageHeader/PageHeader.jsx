import { Meteor } from 'meteor/meteor'
import React, { Component, PropTypes } from 'react';

import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import CommonBikeLogo from '../CommonBikeLogo/CommonBikeLogo.jsx'
import RaisedButton from '../RaisedButton/RaisedButton.jsx'
import Avatar from '../Avatar/Avatar.jsx'

class PageHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={s.base}>
        <div style={s.flex}>
          <a style={s.arrowBack} onClick={() => history.back()}>Back</a>
          <a href="/" style={{display: 'flex'}}><CommonBikeLogo type="common" style={s.logo} /></a>
          { Meteor.userId() ? <Avatar /> : <div /> }
        </div>
        {this.props.children}
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '15px 20px 15px 20px'
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  arrowBack: {
    backgroundImage: 'url("/files/PageHeader/arrow.svg")',
    height: '36px',
    width: '36px',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    textIndent: '-9999px',
    cursor: 'pointer',
    alignSelf: 'center',
  },
  logo: {
    width: '174px',
    height: '28px',
    alignSelf: 'center'
  },
}

PageHeader.propTypes = {
  children: PropTypes.any,
};

export default PageHeader;
