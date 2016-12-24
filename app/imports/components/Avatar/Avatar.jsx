import React, { Component, PropTypes } from 'react';

Avatar = (props) =>
  <div style={Object.assign({}, s.base, props.style)} />

var s = {
  base: {
    backgroundColor: '#fff',
    width: '44px',
    height: '44px',
    border: 'solid 2px #fff',
    borderRadius: '44px',
    backgroundColor: 'rgba(0, 208, 162, 0.05)',
  },
}

export default Avatar;
