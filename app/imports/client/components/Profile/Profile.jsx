import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton';
import '../../../api/users.js'; 


class Profile extends Component {
  constructor(props) {
    super(props);
  }

  newreservation() {
     this.context.history.push('/locations') 
  }

  reservations() {
    this.context.history.push('/objects') 
  }

  locations() { 
    this.context.history.push('/admin/locations') 
  }

  rentals() { 
    this.context.history.push('/admin/rentals') 
  }

  transactions() { 
    this.context.history.push('/transactions') 
  }

  logout() { 
    Meteor.logout(); 
    this.context.history.push('/')
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

          <RaisedButton onClick={this.reservations.bind(this)}>MIJN RESERVERINGEN</RaisedButton>

          <RaisedButton onClick={this.transactions.bind(this)}>MIJN GESCHIEDENIS</RaisedButton>

          <RaisedButton onClick={this.locations.bind(this)}>MIJN LOCATIES</RaisedButton>

          <RaisedButton onClick={this.rentals.bind(this)}>MIJN VERHUUR</RaisedButton>

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

Profile.contextTypes = {
  history: propTypes.historyContext
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
