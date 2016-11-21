import React, { Component, PropTypes } from 'react';

class CommonBikeLogo extends Component {

  constructor(props) {
    super(props);

    this.state = { activeSlide: 0 }
  }

  render() {
    return (
      <div style={s.base}>
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
  },
}

export default CommonBikeLogo;