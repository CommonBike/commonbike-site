import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

import '/imports/api/users.js'
import { Objects } from '/imports/api/objects.js'; 

Meteor.startup(() => {
	// code to run on server at startup

	// fix all 'old' objects in the production database
	if(false) {
		var myObjects = Objects.find().fetch();
		_.each(myObjects, function (objectData) {
		    
		    var timestamp =  new Date().valueOf();
		    var length = 5;
		    var base = Math.pow(10, length+1);
		    var code = Math.floor(base + Math.random() * base)
		    var keycode = code.toString().substring(1, length+1);

			if(!objectData.state) {
			    Objects.update(objectData._id, {$set:{
			      state: {state: 'available',
	              		  userId: null,
	                      timestamp: timestamp}
			    }});
			}

			if(!objectData.lock) {
			    Objects.update(objectData._id, {$set:{
			      lock: {type: 'plainkey',
			             settings: {keyid: keycode }
			         }
			    }});
			}
		});

		var myUsers = Meteor.users.find().fetch();
		_.each(myUsers, function (user) {
			if(!user.profile.active) {
				console.log('update active for' + user._id)
				Meteor.users.update(user._id, {$set : { 'profile.active' : false }});
			}
			if(!user.profile.name) {
				Meteor.users.update(user._id, {$set : { 'profile.name' : 'anonymous' }});
			}
			if(!user.profile.avatar) {
				Meteor.users.update(user._id, {$set : { 'profile.avatar' : '' }});
			}
		});	
	}
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
