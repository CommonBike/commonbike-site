import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

export const Locations = new Mongo.Collection('locations');

LocationsSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
    max: 1000
  },
  imageUrl: {
    type: String,
    label: "Image URL",
    optional: true,
    max: 1000
  },
});

if (Meteor.isServer) {
  Meteor.publish('locations', function tasksPublication() {
    return Locations.find();
  });
}

Meteor.methods({
  'locations.insert'(data) {

    // Make sure the user is logged in
    if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

    // check(data, LocationsSchema);

    var locationId = Locations.insert({
      title: data.title
    });

    // current user is always assigned as first administrator for a new location
    Meteor.users.update({_id: Meteor.userId()}, {$addToSet: {admin_locations: locationId}});
  },
  'locations.update'(_id, data) {

    // Make sure the user is logged in
    if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

    // check(data, LocationsSchema);

    Locations.update(_id, {
      title: data.title,
      imageUrl: data.imageUrl
    });
  },
  'locations.remove'(_id){
    // remove this location from the admin_locations list for all users 
    Meteor.users.update({}, {$pull: {admin_locations: _id}});

    Locations.remove(_id);
  }
});

// The methods below operate on Meteor.users and use Accounts, so they should not be 
// performed on the client (done transparently by Meteor when moved outside of this block)
if(Meteor.isServer) {
  Meteor.methods({
    'locationadmin.getuserlist'(locationId) {
      // return a list of users that are admins for the given location 
      // - admins are maintained as a location id list (admin_locations) in the user document
      var daUsers = Meteor.users.find({admin_locations: {$in: [locationId]}}, 
                                    {fields: {_id:1, emails:1}}).fetch();
      if(daUsers) {
        var result = [];
        daUsers.forEach(function(user) {
          result.push({_id:user._id, email: user.emails[0].address});
        });
        return result;
      } else {
        return [];
      }
    },
    'locationadmin.adduser'(locationId, emailaddress) {
      // given user is added as administrator for the given location
      if(locationId&&emailaddress) {
        var daUser = Accounts.findUserByEmail(emailaddress);
        if(daUser) {
          Meteor.users.update({_id: daUser._id}, {$addToSet: {admin_locations: locationId}});
        } else {
          console.log('locationadmin.addUser: no user exists with ' + emailaddress);
        }
      }
    },
    'locationadmin.removeuser'(locationId, userId) {
      // given user is removed as administrator for the given location
      if(locationId&&userId) {
        Meteor.users.update({_id: userId}, {$pull: {admin_locations: locationId}});
      }
    },
    // NICE TO HAVE: this function is used in the change event in the ManageUserlist component
    // 'locationadmin.emailvalid'(email) {
    //   var daUser = Accounts.findUserByEmail(email);
    //   if(daUser) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
  });
}