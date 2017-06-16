import React, { Component, PropTypes } from 'react';

class CommonBikeLogoDevelopment extends Component {

  render() {
    return (
      <div style={Object.assign({}, s.base, this.props.style, this.props.type == 'common' && {backgroundImage: 'url("/files/PageHeader/common-white-development.png")'})}>
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
    backgroundImage: 'url("/files/PageHeader/commonbike-white-development.png")',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    textIndent: '-9999px',
  },
}

export default CommonBikeLogoDevelopment;
