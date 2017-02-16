import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { RedirectTo } from '/client/main'

// Import components
import RaisedButton from '../Button/RaisedButton';
import '../../../api/users.js'; 


class Profile extends Component {
  constructor(props) {
    super(props);
  }

  newreservation() {
     RedirectTo('/locations') 
  }

  newreservationMap() { 
    RedirectTo('/map') 
  }

  reservations() {
    RedirectTo('/objects') 
  }

  locations() { 
    RedirectTo('/admin/locations') 
  }

  rentals() { 
    RedirectTo('/admin/rentals') 
  }

  transactions() { 
    RedirectTo('/transactions') 
  }

  manageusers() {
    RedirectTo('/admin/users') 
  }

  logout() { 
    Meteor.logout(); 
    RedirectTo('/')
  }

  getUserPersonalia() {
    if(this.props.currentUser && this.props.currentUser.emails) {
      return this.props.currentUser.emails[0].address;
    } else {
      return '';
    }
  }

  // newAvatar :: Event -> NO PURE FUNCTION
  newAvatar(e) {
    if( ! this.props.isEditable) return;

    var imageUrl =
      prompt('Wat is de URL van de nieuwe avatar? Wil je geen nieuwe avatar toevoegen, klik dan op Annuleren/Cancel')

    if(imageUrl) {
      Meteor.call('currentuser.update_avatar', imageUrl);
    }
  }

  getMyLocationsButton() {
    // bestaande providers en gebruikers met rechten kunnen locaties beheren
    var show = this.props.currentUser && this.props.currentUser.profile && 
                        (this.props.currentUser.profile.provider_locations ||
                         this.props.currentUser.profile.cancreatelocations)

    if(Roles.userIsInRole( Meteor.userId(), 'admin')) {
      show = true; // administrators can always manage locations
    }

    if(show) {
      return ( <RaisedButton onClick={this.locations.bind(this)}>MIJN LOCATIES</RaisedButton> )
    } else {
      return ( <div /> )
    }
  }

  getMyRentalsButton() {
    var show = this.props.currentUser && this.props.currentUser.profile && 
               (this.props.currentUser.profile.provider_locations ||
                this.props.currentUser.profile.cancreatelocations)

    if(Roles.userIsInRole( Meteor.userId(), 'admin')) {
      show = true; // administrators can always manage locations
    }

    if(show) {
      return ( <RaisedButton onClick={this.rentals.bind(this)}>MIJN VERHUUR</RaisedButton> )
    } else {
      return ( <div /> )
    }
  }

  getManageUsersButton() {
    if(Roles.userIsInRole( Meteor.userId(), 'admin' )) {
      return ( <RaisedButton onClick={this.manageusers.bind(this)}>GEBRUIKERSBEHEER</RaisedButton> )
    } else {
      return ( <div /> )
    }
  }

  render() {
    self = this;

    // <RaisedButton onClick={this.locations.bind(this)}>MIJN LOCATIES</RaisedButton>

    // <RaisedButton onClick={this.rentals.bind(this)}>MIJN VERHUUR</RaisedButton>

    return (
      <div style={s.base}>

        <div style={s.centerbox}>

          <Avatar style={s.avatar} newAvatar={this.newAvatar.bind(this)} />

          <p style={s.personalia}>
            { this.getUserPersonalia() }
          </p>

          <RaisedButton onClick={this.newreservation.bind(this)}>NIEUWE RESERVERING</RaisedButton>

          <RaisedButton onClick={this.newreservationMap.bind(this)}>ZOEK OP KAART</RaisedButton>

          <RaisedButton onClick={this.reservations.bind(this)}>MIJN RESERVERINGEN</RaisedButton>

          <RaisedButton onClick={this.transactions.bind(this)}>MIJN GESCHIEDENIS</RaisedButton>

          { this.getMyLocationsButton() }

          { this.getMyRentalsButton() }

          { this.getManageUsersButton() }

          <RaisedButton onClick={this.logout.bind(this)}>LOG UIT</RaisedButton>
        </div>

      </div>
    );
  }
}

var s = {
  base: {
    padding: '10px 20px',
    textAlign: 'center'
  },
  personalia: {
    padding: '0 20px',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  avatar: {
    display: 'inline-block',
    width: '200px',
    height: '200px'
  }
}

Profile.propTypes = {
  locations: PropTypes.array,
  isEditable: PropTypes.any,
  clickItemHandler: PropTypes.any,
};

Profile.defaultProps = {
  isEditable: false
}

export default createContainer((props) => {
  Meteor.subscribe('users');

  return {
    currentUser: Meteor.users.findOne()
  };
}, Profile);

//
