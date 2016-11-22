import React, { Component, PropTypes } from 'react';

class CommonBikeLogo extends Component {

  constructor(props) {
    super(props);

    this.state = { activeSlide: 0 }
  }

  render() {
    return (
      <div style={{...s.base, ...this.props.style}}>
        CommonBike
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    color: '#fff',
    fontWeight: 'bold',
    backgroundImage: 'url("/files/CommonBikeLogo/logo.png")',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    textIndent: '-9999px',
  },
}

export default CommonBikeLogo;