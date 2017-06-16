import React, { Component, PropTypes } from 'react';

class VelocityLogo extends Component {

  render() {
    return (
      <div style={Object.assign({}, s.base, this.props.style)}>
        Velocity
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
    // backgroundImage: 'url("/files/Velocity/logo-velocity-medium.png")',
    backgroundImage: 'url("/files/Velocity/bikepassepartout.png")',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    textIndent: '-9999px',
  },
}

export default VelocityLogo;
