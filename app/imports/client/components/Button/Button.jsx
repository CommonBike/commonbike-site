import React, { Component, PropTypes } from 'react';

Button = (props) =>
  <input
    style={Object.assign({}, s.base, props.style, s[props.buttonStyle])}
    type={props.type}
    onClick={props.onClick}
    defaultValue={props.children} />

var s = {
  base: {
    background: '#fbae17',
    maxWidth: '100%',
    color: '#fff',
    fontFamily: 'LatoWebSemibold, sans-serif',
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    padding: '0.4em',
    cursor: 'pointer',
    padding: '10px',
    width: '400px',
    margin: '20px auto',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'solid 5px #bc8311',
    borderLeft: 'none',
    WebkitAppearance: 'none',
    BorderRadius: '0'
  },
  huge: {
    padding: '35px 10px',
    fontSize: '2.5em',
    whiteSpace: 'normal'
  },
  hugeSmallerFont: {
    padding: '35px 10px',
    fontSize: '2.0em',
    whiteSpace: 'normal'
  }
}

Button.propTypes = {
  children: PropTypes.string.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.any,
  // Override the inline-styles of the root element
  style: PropTypes.object,
}

Button.defaultProps = {
  disabled: false,
  labelPosition: 'after',
  fullWidth: false,
  type: 'button',
  primary: false,
  secondary: false
}

export default Button;
