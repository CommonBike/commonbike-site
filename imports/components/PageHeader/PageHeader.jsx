import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import CommonBikeLogo from '../CommonBikeLogo/CommonBikeLogo.jsx'
import RaisedButton from '../RaisedButton/RaisedButton.jsx'

class PageHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={s.base}>
        <div style={s.flex}>
          <a style={s.arrowBack} onClick={() => history.back()}>Back</a>
          <a href="/"><CommonBikeLogo type="common" style={s.logo} /></a>
          <div>&nbsp;</div>
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
    padding: '20px 20px 0 20px'
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
    cursor: 'pointer'
  },
  logo: {
    width: '230px',
    height: '36px'
  },
}

PageHeader.propTypes = {
  children: PropTypes.any,
};

export default PageHeader;
