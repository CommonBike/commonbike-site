// Import libraries & helpers
import Radium, { StyleRoot } from 'radium';
import React, { Component, PropTypes } from 'react';

class SocialShare extends Component  {

  constructor(props) {
    super(props);
  }

  //+ showPopup :: Event -> false
  showPopup(e) {
    var width = 980;
    var height = 500;
    var leftPosition = undefined
    var topPosition = undefined
    var leftPosition = window.screen.width / 2 - (width / 2 + 10)
    var topPosition = window.screen.height / 2 - (height / 2 + 50)
    var windowFeatures = 'status=no,height=' + height + ',width=' + width + ',resizable=yes,left=' + leftPosition + ',top=' + topPosition + ',screenX=' + leftPosition + ',screenY=' + topPosition + ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no'
    window.open($(e.target).attr('href'), 'sharer', windowFeatures);
    return false;
  }

  render() {

    var shareUrls = {
      facebook: 'http://www.facebook.com/sharer.php?u='+encodeURIComponent(document.location),
      twitter: 'https://twitter.com/share?purl='+encodeURIComponent(document.location)+'&text='+encodeURIComponent(''+this.props.article.articleTitle+' @tygers_magazine'),
      linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(document.location)+'&title='+encodeURIComponent(''+this.props.article.articleTitle+'')+'&summary='+encodeURIComponent('Bekijk dit artikel op TYGERS Magazine')+'&source='+encodeURIComponent(document.location),
      email: 'mailto:?subject='+encodeURIComponent(this.props.article.articleTitle)+'&body='+encodeURIComponent('I found an interesting article for you on TYGERS Magazine, thé online startup magazine. Check '+ document.location)
    }

    return (
      <div style={styles.base}>
        <div style={Object.assign({}, styles.shareButtonWrapper, this.state.isShareActionWrapperVisible && {display: 'block'})}>
          <a key="facebookShare" onClick={this.showPopup.bind(this)} href={shareUrls.facebook} target="_blank" style={Object.assign({}, styles.shareButton, styles.facebook, this.state.isShareActionWrapperVisible && styles.showDelay)}>f</a>
          <a key="twitterShare" onClick={this.showPopup.bind(this)} href={shareUrls.twitter} target="_blank" style={Object.assign({}, styles.shareButton, styles.twitter, this.state.isShareActionWrapperVisible && styles.showDelay)}>t</a>
          <a key="linkedInShare" onClick={this.showPopup.bind(this)} href={shareUrls.linkedin} target="_blank" style={Object.assign({}, styles.shareButton, styles.linkedin, this.state.isShareActionWrapperVisible && styles.showDelay)}>t</a>
          <a key="emailShare" href={shareUrls.email} target="_blank" style={Object.assign({}, styles.shareButton, styles.email, this.state.isShareActionWrapperVisible && styles.showDelay)}>@</a>
        </div>
      </div>
    );
  }
};

var styles = {
  base: {
    order: 1,
    display: 'flex',
    position: 'fixed',
    '@media (min-width: 700px)': {
      display: 'block'
    }
  },
  triggerButton: {
    backgroundColor: '#000',
    color: '#fff',
    cursor: 'default',
    width: '55px',
    height: '55px',
    backgroundImage: 'url("http://tygersmagazine.nl/img/icon/share-icon.svg")',
    backgroundColor: '#c3c3c3',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    filter: 'grayscale(1)',
    textIndent: '-9999px',
    backgroundSize: '22px',
    display: 'none',
    '@media (min-width: 700px)': {
      display: 'block',
    }
  },
  shareButtonWrapper: {
    opacity: 1,
    display: 'flex',
    '@media (min-width: 700px)': {
      display: 'block',
    }
  },
  shareButton: {
    backgroundColor: '#000',
    borderLeft: 'solid 0.5px #fff',
    color: '#fff',
    cursor: 'pointer',
    width: '64px',
    height: '64px',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    textIndent: '-9999px',
    display: 'flex',
    backgroundSize: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    '@media (min-width: 700px)': {
      borderLeft: 'none',
      width: '55px',
      height: '55px',
    }
  },
  facebook: {
    color: '#fff',
    backgroundImage: 'url("http://tygersmagazine.nl/img/icon/share/button-facebook.png")',
    backgroundColor: '#374C8B',
  },
  twitter: {
    color: '#fff',
    backgroundImage: 'url("http://tygersmagazine.nl/img/icon/share/button-twitter.png")',
    backgroundColor: '#3AA0EB'
  },
  linkedin: {
    color: '#fff',
    backgroundImage: 'url("http://tygersmagazine.nl/img/icon/share/button-linkedin.png")',
    backgroundColor: '#006eb3'
  },
  email: {
    color: '#fff',
    backgroundImage: 'url("http://tygersmagazine.nl/img/icon/share/button-mail.png")',
    backgroundColor: '#EB953B'
  }
}

export default Radium(SocialShare);
