import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactSwipe from 'react-swipe';
import R from 'ramda';

// Necessary for material-ui
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Import templates
import RaisedButton from 'material-ui/RaisedButton';

// Import components
import ImageSlide from '../ImageSlide/ImageSlide.jsx';
import BulletNav from '../BulletNav/BulletNav.jsx';

class WelcomePage extends Component {

  constructor(props) {
    super(props);

    this.state = { activeSlide: 0 }

    // Needed for onTouchTap
    // http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin();
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  // renderImageSlide :: String -> Component
  renderImageSlide(slide) { return <ImageSlide key={slide.title} slide={slide} /> }

  // setActiveSlide :: Integer -> StateChange
  setActiveSlide(activeSlide) {
    this.setState({activeSlide});
    this.refs.reactSwipe.slide(activeSlide);
  }

  // swipeCallback
  swipeCallback(index, elem) { this.setActiveSlide(index) }

  render() {
    slides = [
      {
        title: 'Find a bike', description: 'on-the-go (in train or bus or car)',
        image: '/files/WelcomePage/slide1.jpg'//https://www.instagram.com/p/BH7ay5ZBa6H/
      },
      {
        title: 'Make sure a bike will be waiting for you', description: 'Make a reservation',
        image: '/files/WelcomePage/slide2.jpg'//https://www.instagram.com/p/BMGTP_bBBf6/
      },
      {
        title: 'Ready to go!', description: 'enjoy your ride',
        image: '/files/WelcomePage/slide3.jpg'//https://www.facebook.com/rotterdamfietschic/photos/a.856460737791713.1073741829.853861664718287/870227543081699/?type=3&theater
                                              //https://www.facebook.com/rotterdamfietschic/photos/a.856460737791713.1073741829.853861664718287/861041654000288/?type=3&theater
                                              //https://www.facebook.com/rotterdamfietschic/photos/a.856460737791713.1073741829.853861664718287/861039667333820/?type=3&theater
                                              //https://www.facebook.com/rotterdamfietschic/photos/a.856460737791713.1073741829.853861664718287/859932990777821/?type=3&theater
      },
    ];
    return (
      <div style={s.base}>
        <h1 style={Object.assign({}, s.logoWrapper, this.state.activeSlide == 3 && {color: '#000'})}>
          <span style={s.logoName}>CommonBike</span>
          <span style={s.logoTagLine}>Pak een fiets</span>
        </h1>
        <ReactSwipe ref="reactSwipe" swipeOptions={{continuous: false, callback: this.swipeCallback.bind(this)}} style={s.slideWrapper}>
          {R.map(this.renderImageSlide, slides)}
          <div>
            <RaisedButton label="Aanmelden" primary={true} style={s.signUpButton} />
            <RaisedButton label="Inloggen" secondary={true} style={s.signUpButton} />
          </div>
        </ReactSwipe>
        <BulletNav numSlides="3" activeSlide={this.state.activeSlide} setActiveSlide={this.setActiveSlide.bind(this)} />
      </div>
    );
  }
}

var s = {
  base: {
    background: 'linear-gradient(90deg, #e3e4e5, transparent)',
    fontSize: 'default',
    lineHeight: 'default',
    width: '100%',
    height: '100%',
    color: '#fff',
    filter: 'brightness(80%)',
  },
  logoWrapper: {
    position: 'fixed',
    zIndex: 5,
    top: '10px',
    left: '10px',
    width: '100%',
    fontWeight: '500',
    textAlign: 'center',
  },
  logoName: {
    fontSize: '1em'
  },
  logoTagLine: {
    display: 'block',
    fontSize: '0.5em'
  },
  slideWrapper: {
    container: {
      overflow: 'hidden',
      visibility: 'hidden',
      position: 'relative',
      height: '100%'
    },
    wrapper: {
      overflow: 'hidden',
      position: 'relative',
      height: '100%'
    },
    child: {
      float: 'left',
      width: '100%',
      position: 'relative',
      transitionProperty: 'transform',

      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100%'
    },
  },
  signUpButton: {
    margin: '10px 0',
  }
}

WelcomePage.childContextTypes = {
  muiTheme: PropTypes.object
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, WelcomePage);
