import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

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
      // console.log(user.id, 'status set to', user.active)
    }

  })
}
