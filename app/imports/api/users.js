import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

// user profile data serverside  functions
Meteor.methods({
	'currentuser.update_avatar'(new_avatar_url) {
	  if(this.userId) {
	    Meteor.users.update(this.userId, {$set : { 'profile.avatar' : new_avatar_url }});
	  }
	}
});
