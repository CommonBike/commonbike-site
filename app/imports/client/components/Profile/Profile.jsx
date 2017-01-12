import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton';

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

  render() {
    self = this;
    return (
      <div style={s.base}>

        <div style={s.centerbox}>

          <Avatar style={s.avatar} />

          <p style={s.personalia}>
            { this.getUserPersonalia() }
          </p>

          <RaisedButton onClick={this.newreservation.bind(this)}>NIEUWE RESERVERING</RaisedButton>

          <RaisedButton onClick={this.reservations.bind(this)}>MIJN RESERVERINGEN</RaisedButton>

          <RaisedButton onClick={this.locations.bind(this)}>MIJN LOCATIES</RaisedButton>

          <RaisedButton onClick={this.logout.bind(this)}>LOG UIT</RaisedButton>
        </div>

{/*}        {R.map((location) =>  <LocationBlock
                                key={location._id}
                                item={location}
                                isEditable={self.props.isEditable}
                                onClick={self.props.clickItemHandler} />
                              , this.props.locations)}
*/}
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
    display: 'inline-block'
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
