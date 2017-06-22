import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'
import { Integrations } from '/imports/api/integrations.js';
import { getSettingsServerSide } from '/imports/api/settings.js';
import { CoinSchema } from '/imports/api/bikecoinschema.js';

export const UserProfileSchema = new SimpleSchema({
  active: {
    type: Boolean,
    label: "Active",
    defaultValue: 'false'
  },
  'name': {
    type: String,
    label: "Name",
    defaultValue: 'anonymous'
  },
  'avatar': {
    type: String,
    label: "Avatar",
    defaultValue: ''
  },
  cancreatelocations: {
    type: Boolean,
    label: "Can Create Locations",
    defaultValue: 'false'
  },
  wallet: {
    type: CoinSchema
  },
});

// publish all users if current user is administrator (for client side adminstration)
if(Meteor.isServer) {
    Meteor.publish("allusers", function() {
    if (!this.userId) {
        return this.ready();
    }

    if(!Roles.userIsInRole( this.userId, 'admin' )) {
        return this.ready();
    }

    var users = Meteor.users.find();
    return users;
  });
}

// general purpose functions
export const getUserDescription = (user) => {
  var description = '';
  if(user.emails && user.emails.length>0 && user.emails[0].address) {
    description = user.emails[0].address;
  } else {
    description = 'id:' + user._id;
  }

  return description;
}

// user profile data serverside functions
if(Meteor.isServer) {

  // Validate username, sending a specific error message on failure.
  Accounts.validateNewUser((user) => {
    if(user.emails && user.emails.length>0 && user.emails[0].address) {
      user_email = user.emails[0].address;
      user_pass = user.services.password
    }

    else {
      return false;
    }

    return true;
  });

  Accounts.onCreateUser((options, user) => {
    // We still want the default hook's 'profile' behavior.
    user.profile = options.profile || {};

    if(getSettingsServerSide().onboarding.enabled) {
      user.profile.active = true;
    }

    return user;
  });

  Meteor.methods({
    'currentuser.update_avatar'(new_avatar_url) {
      if(this.userId) {
        Meteor.users.update(this.userId, {$set : { 'profile.avatar' : new_avatar_url }});
      }
    },
    'userstatus.set'(user) {
      pattern = {
        id: String,
        active: Boolean,
      }
      check(user, pattern)

      if (!Roles.userIsInRole(this.userId, 'admin')) {
        return
      }

      Meteor.users.update(user.id, {$set : { 'profile.active' : user.active }});
    },
    'currentuser.setActive'(userId, isActive) {
      if(!this.userId) {
        return
      }

      if (!Roles.userIsInRole(this.userId, 'admin')) {
        return
      }

      var data = { 'profile.active' : isActive }

      var user = Meteor.users.findOne(userId);
      if(user) {
        if(!user.profile || !user.profile.wallet || (user.profile.wallet.address=='' && user.profile.wallet.privatekey=='')) {

          var keypair = BikeCoin.newKeypair();
          data = { 'profile.active' : isActive,
                   'profile.wallet.address':  keypair.address,
    		           'profile.wallet.privatekey':  keypair.privatekey
                  }
        }
      }

      Meteor.users.update(userId, {$set : data});

      if(isActive) {
        Integrations.slack.sendNotification('Er is een nieuwe deelnemer geactiveerd!');
      }
    },
    'currentuser.setAdmin'(userId, isActive) {
      if(!this.userId) {
        return
      }

      if (!Roles.userIsInRole(this.userId, 'admin')) {
        return
      }

      if (isActive) {
        Roles.addUsersToRoles(userId, ['admin']);
      } else {
        Roles.removeUsersFromRoles(userId, ['admin']);
      }
    },
    'currentuser.canCreateLocations'(userId, isActive) {
      if(!this.userId) {
        return
      }

      if (!Roles.userIsInRole(this.userId, 'admin')) {
        return
      }

      Meteor.users.update(userId, {$set : { 'profile.cancreatelocations' : isActive }});
    },
    'currentuser.AutoOnboard'() {
      if(!this.userId) {
        return
      }

      if(!getSettingsServerSide().onboarding.enabled) {
        return
      }

      console.log('AutoOnboarding user ' + this.userId);

			var keypair = BikeCoin.newKeypair();
      Meteor.users.update(this.userId, {$set : { 'profile.active' : true,
                                                 'profile.wallet' : { address : keypair.address,
                                                                      privatekey :  keypair.privatekey
                                                                    }
                                                }
                                        });

      Integrations.slack.sendNotification('Er is een nieuwe deelnemer geactiveerd!');
    }
  })
}
