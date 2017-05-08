import { Meteor } from 'meteor/meteor'
import React, { Component, PropTypes } from 'react';

import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import CommonBikeLogo from '../CommonBikeLogo/CommonBikeLogo.jsx'
import CommonBikeLogoDevelopment from '../CommonBikeLogoDevelopment/CommonBikeLogoDevelopment.jsx'
import BackButton from '../Button/BackButton.jsx'
import RaisedButton from '../Button/RaisedButton.jsx'
import Avatar from '../Avatar/Avatar.jsx'
import { RedirectTo } from '/client/main'

class PageHeader extends Component {

  constructor(props) {
    super(props);
  }

  gotoProfile() {
    RedirectTo('/profile');
  }

  getLogo() {
    if(Meteor.isProduction) {
      return (<CommonBikeLogo type="common" style={s.logo} />);
    } else {
      return (<CommonBikeLogoDevelopment type="common" style={s.logo} />);
    }
  }

  render() {
    return (
      <div style={s.base}>
        <div style={s.flex}>
          <BackButton />
          <a onClick={() => RedirectTo('/locations')} style={{display: 'flex'}}>{this.getLogo()}</a>
          { Meteor.userId() ? <a onClick={this.gotoProfile.bind(this)}><Avatar /></a> : <div /> }
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
  logo: {
    width: '174px',
    height: '28px',
    alignSelf: 'center'
  },
}

PageHeader.propTypes = {
  children: PropTypes.any,
};

export default PageHeader
