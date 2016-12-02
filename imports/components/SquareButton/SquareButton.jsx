import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class SquareButton extends Component {
 
  constructor(props) {
    super(props);
  }

  claimSquareButton() {
    this.props.claimSquareButton();
  }

  render() {
    return (
      <button style={Object.assign({}, s.base, this.props.src && s[this.props.src])} onClick={this.props.onClick.bind(this)} />
    );
  }
}

var s = {
  base: {
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    width: '128px',
    height: '128px',
    // minHeight: '75px',
    maxHeight: '128px',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    display: 'block',
    textIndent: '-9999px',
    display: 'flex',
    backgroundSize: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '0 auto',
    backgroundColor: 'transparent',
  },
  google: {
    backgroundSize: '65%',
    backgroundImage: 'url(/files/SquareButton/google.svg)'
  },
  github: {
    backgroundSize: '65%',
    backgroundImage: 'url(/files/SquareButton/github.svg)'
  },
  twitter: {
    backgroundPosition: 'center 35%',
    backgroundImage: 'url(/files/SquareButton/twitter.svg)'
  },
  facebook: {
    backgroundPosition: 'center 35%',
    backgroundImage: 'url(/files/SquareButton/facebook.svg)'
  },

}

export default SquareButton;