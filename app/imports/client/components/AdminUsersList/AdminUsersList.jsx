import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { Link } from 'react-router';
import { RedirectTo } from '/client/main'

// Import components
import UserDetails from '../UserDetails/UserDetails.jsx';

/**
 *  AdminUsersList
 * 
 * @param {Object} users
 * @param {Boolean} isEditable
 */
class AdminUsersList extends Component {

  constructor(props) {
    super(props);
  }

  userReadonly(userid) {
    return Meteor.userId()!=userid;
  }

  render() {
    currentuser = Meteor.userId();
    return (
      <div style={s.base}>
        <div style={Object.assign({display: 'none'}, this.props.isEditable && {display: 'block'})}>

          <p style={s.paragraph}>
            Op deze pagina kun je gebruikers beheren. 
          </p>
        </div>

        { R.map((User) => <UserDetails key={User._id} user={User} currentuser={currentuser} isEditable={this.props.isEditable} />, this.props.users) }

      </div>
    );
  }
}

var s = {
  base: {
    padding: '10px 20px',
    textAlign: 'center'
  },
  paragraph: {
    padding: '0 20px'
  }
}

AdminUsersList.propTypes = {
  users: PropTypes.any,
  isEditable: PropTypes.any
};

AdminUsersList.defaultProps = {
  users: [],
  isEditable: false
}

export default AdminUsersList
