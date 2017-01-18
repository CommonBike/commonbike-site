import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

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

// user profile data serverside  functions
if(Meteor.isServer) {
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

      Meteor.users.update(userId, {$set : { 'profile.active' : isActive }});

      if(isActive) {
          Meteor.call('slack.sendnotification_commonbike', 'Er is een nieuwe deelnemer geactiveerd!');
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
  })
}
