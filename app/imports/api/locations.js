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
  address: {
    type: String,
    label: "Address",
    max: 200
  },
  lat_lng: {
    type: [Number],
    label: "GPS location",
    max: 2
  },
  imageUrl: {
    type: String,
    label: "Image URL",
    optional: true,
    max: 1000
  },
});

if (Meteor.isServer) {
  Meteor.publish('locations', function tasksPublication(providerMode=false) {
    if (!this.userId) {
        return this.ready();
    }

    if(!providerMode) {
      return Locations.find();
    } else {
      if(Roles.userIsInRole(this.userId, ['admin'])) {
        return Locations.find();
      } else {
        var daUser = Meteor.users.findOne({_id:this.userId});
        if (daUser&&daUser.profile.provider_locations) {
          return Locations.find({_id: {$in: daUser.profile.provider_locations}});  
        } else {
          return this.ready();      
        }
      }
    }
  });
}

// The methods below operate on Meteor.users and use Accounts, so they should not be 
// performed on the client (done transparently by Meteor when moved outside of this block)
if(Meteor.isServer) {
  Meteor.methods({
    'locations.insert'(data) {

      // Make sure the user is logged in
      if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

      // check(data, LocationsSchema);

      var locationId = Locations.insert({
      });

      // current user is always assigned as first provider for a new location
      Meteor.users.update({_id: Meteor.userId()}, {$addToSet: {'profile.provider_locations': locationId}});

      Locations.update(locationId, {
        title: data.title
      });  

      return locationId
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
      // remove this location from the 'profile.provider_locations' list for all users 
      Meteor.users.update({}, {$pull: {'profile.provider_locations': _id}});

      Locations.remove(_id);
    },
    'locationprovider.getuserlist'(locationId) {
      // return a list of users that are providers for the given location 
      // - providers are maintained as a location id list ('profile.provider_locations') 
      // in the user document
      var daUsers = Meteor.users.find({'profile.provider_locations': {$in: [locationId]}}, 
                                    {fields: {_id:1, emails:1}}).fetch();
      if(daUsers) {
        var result = [];
        daUsers.forEach(function(user) {
          if(user.emails) {
            result.push({_id: user._id, email: user.emails[0].address});
          }
        });
        return result;
      } else {
        return [];
      }
    },
    'locationprovider.adduser'(locationId, emailaddress) {
      // given user is added as provider for the given location
      if(locationId&&emailaddress) {
        var daUser = Accounts.findUserByEmail(emailaddress);
        if(daUser) {
          Meteor.users.update({_id: daUser._id}, {$addToSet: {'profile.provider_locations': locationId}});
        } else {
          throw new Meteor.Error('No user exists with email: ' + emailaddress, 'locationprovider.addUser: No user exists with email: ' + emailaddress);
        }
      }
    },
    'locationprovider.removeuser'(locationId, userId) {
      // given user is removed as provider for the given location
      if(locationId&&userId) {
        Meteor.users.update({_id: userId}, {$pull: {'profile.provider_locations': locationId}});
      }
    },
    'currentuser.update_avatar'(new_avatar_url) {
      if(this.userId) {
        Meteor.users.update(this.userId, {$set : { 'profile.avatar' : new_avatar_url }});
      }
    }
    // NICE TO HAVE: this function is used in the change event in the ManageUserlist component
    // 'locationprovider.emailvalid'(email) {
    //   var daUser = Accounts.findUserByEmail(email);
    //   if(daUser) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
  });
}
