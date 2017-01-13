import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import '/imports/api/users.js'
import AdminUsersListComponent from '../../components/AdminUsersList/AdminUsersList';

class AdminUsersList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AdminUsersListComponent users={this.props.users} isEditable={this.props.isEditable}  />
    );
  }
}

AdminUsersList.propTypes = {
  users: PropTypes.array,
  isEditable: PropTypes.any
};

AdminUsersList.defaultProps = {
  users: [],
  isEditable: false,
}

export default createContainer((props) => {
	Meteor.subscribe('allusers');

  var users = Meteor.users.find({}, { sort: {title: 1} }).fetch();

	return {
  	users: users
	};
}, AdminUsersList);
