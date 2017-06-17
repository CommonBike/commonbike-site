import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import CheckInOutProcessBase from '../CheckInOutProcess/CheckInOutProcessBase';
import { StyleProvider } from '../../StyleProvider.js'
import { getUserDescription } from '/imports/api/users.js';

// Import components
import Button from '../Button/Button';

class CheckInOutProcessGoAboutLock extends CheckInOutProcessBase {
  constructor(props) {
    super(props);
  }

  rentBicycle() {
    // Meteor.call('skopei.rentbike', this.props.object._id, this.props.locationId, (error, result) => {
    //   if(error) {
    //     Meteor.call('log.write', 'unable to call skopei.rentbike method',error);
    //   }
    // })
  }

  endRentBicycle() {
    // Meteor.call('skopei.endrentbike', this.props.object._id, this.props.locationId, (error, result) => {
    //   if(error) {
    //     Meteor.call('log.write', 'unable to call skopei.endrentbike method',error);
    //   }
    // })
  }

  openLink() {
    var link = "https://goabout.com/checkout/overview?productUrl=https%253A%252F%252Fapi.goabout.com%252Fproduct%252F302&discountcode=" + this.props.object.state.rentalInfo.pincode;
    var win = window.open(link);
    win.focus();
  }

  renderButtonsForUser() {
    var link="";

    return (
      <div style={s.base}>
        {this.props.object.state.state=='available' ?
        <div>
          <ul style={s.list}>
            <Button onClick={()=>this.openLink().bind(this)} buttonStyle="hugeSmallerFont">RENT FOR FREE</Button>
            <li style={s.listitem}>Open the bike with the GoAbout App</li>
            <li style={s.listitem}><a target="_blank" href="https://itunes.apple.com/nl/app/goabout/id1096695338?mt=8"><img src="/files/ProviderLogos/appstore.png" alt="Download in the app store" /></a></li>
            <li style={s.listitem}><a target="_blank" href="https://play.google.com/store/apps/details?id=com.goabout.goaboutapp"><img src="/files/ProviderLogos/playstore.png" alt="Download in the app store" /></a></li>
          </ul>
          </div>
          : <div /> }
        {this.props.object.state.state=='inuse' ?
          <div>
            {/*<ul style={s.list}>
              <li style={s.listitem, s.mediumFont}>{this.props.object.description}</li>
              <li style={s.listitem, s.mediumFont}>PINCODE</li>
              <li style={s.listitem, s.largeFont}>{this.props.object.state.rentalInfo.pincode}</li>
              <li style={s.listitem}>Uw huurperiode loopt tot {this.getNeatEndTime()} uur.</li>
            </ul>*/}
            <Button style={s.button} onClick={() => this.endRentBicycle() } buttonStyle="hugeSmallerFont">ANNULEER</Button>
          </div>
          : <div /> }
        {this.props.object.state.state=='outoforder' ?
            <Button style={s.button} onClick={() => this.setObjectAvailable() } buttonStyle="hugeSmallerFont">STEL IN BEDRIJF</Button>
          : <div /> }
      </div>
    );
  }
}

var s = StyleProvider.getInstance().checkInOutProcess;

CheckInOutProcessGoAboutLock.propTypes = {
  locationId: PropTypes.string,
  object: PropTypes.object,
  isProvider: PropTypes.any
};

CheckInOutProcessGoAboutLock.defaultProps = {
  locationId: null,
  object: null,
  isProvider: false
}

export default CheckInOutProcessGoAboutLock;
