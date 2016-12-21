import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  newreservation() {
     FlowRouter.go('locations'); 
  }

  reservations() {
     // FlowRouter.go('/'); 
  }

  locations() { 
    FlowRouter.go('adminLocations') 
  }

  logout() { 
    Meteor.logout(); 
    FlowRouter.go('landing');
  }

  getUserPersonalia() {
    if(this.props.currentUser) {
      return this.props.currentUser.emails[0].address;
    } else {
      return 'LOADING...';
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

          <RaisedButton onClick={this.newreservation}>NIEUWE RESERVERING</RaisedButton>

          <RaisedButton onClick={this.reservations}>MIJN RESERVERINGEN</RaisedButton>

          <RaisedButton onClick={this.locations}>MIJN LOCATIES</RaisedButton>

          <RaisedButton onClick={this.logout}>LOG UIT</RaisedButton>
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