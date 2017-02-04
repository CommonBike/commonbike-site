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
    width: '60px',
    height: '60px',
    maxHeight: '60px',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    display: 'block',
    textIndent: '-9999px',
    display: 'flex',
    backgroundSize: '45px',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '0 auto',
    backgroundColor: 'transparent',
  },
  google: {
    backgroundImage: 'url(/files/SquareButton/google.svg)'
  },
  github: {
    backgroundImage: 'url(/files/SquareButton/github.svg)'
  },
  twitter: {
    backgroundSize: 'auto 40px',  
    backgroundImage: 'url(/files/SquareButton/twitter.svg)'
  },
  facebook: {
    backgroundSize: 'auto 40px',
    backgroundImage: 'url(/files/SquareButton/facebook.svg)'
  },

}

export default SquareButton;