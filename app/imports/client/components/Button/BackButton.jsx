import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

class BackButton extends Component {

  render() {
    return <a style={s.arrowBack} onClick={() => history.back()}>Back</a>
  }

}

var s = {
  arrowBack: {
    backgroundImage: 'url("/files/PageHeader/arrow.svg")',
    height: '36px',
    width: '36px',
    backgroundPosition: 'center left',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    textIndent: '-9999px',
    cursor: 'pointer',
    alignSelf: 'center',
    display: 'inline-block'
  }
}

BackButton.propTypes = {
}

BackButton.defaultProps = {
}

export default Radium(BackButton);
