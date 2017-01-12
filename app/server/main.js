import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import '/imports/api/users.js'

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods( {
  'login.finduser'(email) {
    var daUser = Accounts.findUserByEmail(email);
    if(daUser) {
      return [daUser];
    } else {
      return [];
    }
  }
});
