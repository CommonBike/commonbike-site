import React, { Component, PropTypes } from 'react';

CheckInCode = (props) =>
  <div style={Object.assign({}, s.base, props.style)}>

    <div style={s.title}>
      {props.title}
    </div>

    <div style={s.code}>
      {props.code}
    </div>

  </div>

var s = {
  base: {
    backgroundColor: '#fff',
    padding: '20px 10px',
    margin: '20px 0',
    maxHeight: '120px'
  },
  title: {
    fontSize: '1.2em',
    fontWeight: 500
  },
  code: {
    fontSize: '3.5em',
    padding: '5px 0',
    letterSpacing: '10px',
    fontWeight: 500
  }
}

CheckInCode.propTypes = {
  // Override the inline-styles of the root element
  style: PropTypes.object,
  title: PropTypes.string,
  code: PropTypes.string
}

CheckInCode.defaultProps = {
  title: "Je reservering",
  code: "4571"
}

export default CheckInCode;
