import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'radium';

class ImageSlide extends Component {
 
  constructor(props) { super(props) }

  render() {
    return (
      <div style={s.base}>
        <h1 style={s.title}>{this.props.slide.title}</h1>
        <p style={s.description}>{this.props.slide.description}</p>
        <div style={Object.assign({}, s.backgroundImage, {backgroundImage: 'url("'+this.props.slide.image+'")'})}></div>
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    textAlign: 'center',
    paddingBottom: '60px',
    float: 'left',
    width: '100%',
    position: 'relative',
    transitionProperty: 'transform'
  },
  backgroundImage: {
    zIndex: '-1',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundPosition: 'center center',
    backgroundColor: 'linear-gradient(90deg, #e3e4e5, transparent)',
    backgroundSize: 'cover',
    filter: 'brightness(80%)'
  },
  title: {
    display: 'block',
    fontWeight: 'bold',
    fontSize: '1em',
    margin: '5px',
  },
  description: {
    display: 'block',
    fontSize: '1em',
    marginTop: '5px',
    marginBottom: '20px',
  }
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, ImageSlide);
