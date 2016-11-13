import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactSwipe from 'react-swipe';
import R from 'ramda';

// Import components
import ImageSlide from '../ImageSlide/ImageSlide.jsx';
import BulletNav from '../BulletNav/BulletNav.jsx';
import SignUp from '../SignUp/SignUp.jsx';

class WelcomePage extends Component {

  constructor(props) {
    super(props);

    this.state = { activeSlide: 0 }
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
        title: 'Open CommonBike app', description: 'on-the-go (in train or bus or car)',
        image: '/files/WelcomePage/slide1.jpg'//https://www.instagram.com/p/BH7ay5ZBa6H/
      },
      {
        title: 'Make sure a bike will be waiting for you', description: 'be ready to go (make reservation) {for a smooth transfer}',
        image: '/files/WelcomePage/slide2.jpg'//https://www.instagram.com/p/BMGTP_bBBf6/
      },
      {
        title: 'Go!', description: 'go go!',
        image: '/files/WelcomePage/slide3.jpg'//https://www.facebook.com/rotterdamfietschic/photos/a.856460737791713.1073741829.853861664718287/870227543081699/?type=3&theater
                                              //https://www.facebook.com/rotterdamfietschic/photos/a.856460737791713.1073741829.853861664718287/861041654000288/?type=3&theater
                                              //https://www.facebook.com/rotterdamfietschic/photos/a.856460737791713.1073741829.853861664718287/861039667333820/?type=3&theater
                                              //https://www.facebook.com/rotterdamfietschic/photos/a.856460737791713.1073741829.853861664718287/859932990777821/?type=3&theater
      },
    ];
    return (
      <div style={s.base}>
        <ReactSwipe ref="reactSwipe" swipeOptions={{continuous: false, callback: this.swipeCallback.bind(this)}} style={s.slideWrapper}>
          {R.map(this.renderImageSlide, slides)}
          <div>
            <SignUp />
          </div>
        </ReactSwipe>
        <BulletNav numSlides="3" activeSlide={this.state.activeSlide} setActiveSlide={this.setActiveSlide.bind(this)} />
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    width: '100%',
    height: 'calc(100% - 64px)',
    overflow: 'auto',
    color: '#fff',
  },
  slideWrapper: {
    container: {
      height: '100%',
      overflow: 'hidden',
      visibility: 'hidden',
      position: 'relative',
      textAlign: 'center',
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
      padding: '20px 20px 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100%',
    },
  },
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, WelcomePage);
