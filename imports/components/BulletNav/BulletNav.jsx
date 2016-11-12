import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

class BulletNav extends Component {
 
  constructor(props) { super(props); }

  clickNavigationItem(nr) {
    this.props.setActiveSlide(nr);
  }

  renderNavigationItem(nr) {
    return <a key={nr} style={Object.assign({}, s.navigationItem, this.props.activeSlide == nr && s.navigationItemActive)} onClick={this.clickNavigationItem.bind(this, nr)}></a>
  }

  render() {
    return (
      <nav style={s.base}>
        {R.times(this.renderNavigationItem.bind(this), parseInt(this.props.numSlides) + 1)}
      </nav>
    );
  }
}

var s = {
  base: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    bottom: '10px',
    left: 0,
  },
  navigationItem: {
    display: 'block',
    margin: '10px',
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    padding: '5px',
    backgroundColor: '#eee',
    cursor: 'pointer',
  },
  navigationItemActive: {
    backgroundColor: '#009999',
  }
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, BulletNav);
