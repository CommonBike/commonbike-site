import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

import { getUserDescription } from '/imports/api/users.js';
import { Integrations } from '/imports/api/integrations.js';

export const Locations = new Mongo.Collection('locations');
export const LocationsFiltered = new Mongo.Collection('locationsfiltered');

// MB: GPS coordinates are always stored as array. Empty array means not set
// (needed for schema validation)
export const LocationsSchema = new SimpleSchema({
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
    type:   Array,
    label: "GPS location",
    maxCount: 2
  },
  'lat_lng.$': {
    type: Number,
    decimal: true,
    optional: true
  },
  imageUrl: {
    type: String,
    label: "Image URL",
    optional: true,
    max: 1000
  },
  locationType: {
    type: String,
    label: "Location type",
    optional: false,
    max: 32
  },
  externalId: {
    type: String,
    label: "External id",
    optional: false,
    max: 128
  }
});

if (Meteor.isServer) {
  Meteor.publish('locations', function tasksPublication(providerMode=false) {
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

export const Address2LatLng = (address) => {
  if (!address) {
    return ''
  }

  const url = 'http://maps.google.com/maps/api/geocode/json?address=' + encodeURI(address)
  const response = HTTP.get(url)
  const obj = JSON.parse(response.content)
  if(obj.results.length>0) {
    const location = obj.results[0].geometry.location
    return [location.lat, location.lng]
  } else {
    return ''
  }
}

// The methods below operate on Meteor.users and use Accounts, so they should not be
// performed on the client (done transparently by Meteor when moved outside of this block)
if(Meteor.isServer) {
  Meteor.methods({
    'locations.insert'(data) {

      // Make sure the user is logged in
      if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

      // Insert location
      var locationId = Locations.insert({});

      // Current user is always assigned as first provider for a new location
      Meteor.users.update({_id: Meteor.userId()}, {$addToSet: {'profile.provider_locations': locationId}});

  	  // Strip HTML tags from location title
  	  var strippedTitle = data.title.replace(/<.*?>/g, " ").replace(/\s+/g, " ").trim();

      // Save location title
      Locations.update(locationId, {
        title: strippedTitle
      });

      // Create Slack message
      var description = getUserDescription(Meteor.user()) + ' heeft een nieuwe locatie ' + data.title + ' toegevoegd';
      Meteor.call('transactions.addTransaction', 'ADD_LOCATION', description, Meteor.userId(), locationId, null, data);

      var slackmessage = 'Weer een nieuwe locatie toegevoegd: ' + data.title;
      Integrations.slack.sendNotification(slackmessage);

      return locationId
    },
    'locations.update'(_id, data) {

      // Make sure the user is logged in
      if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

  	  // Strip HTML tags from location title
  	  var strippedTitle = data.title.replace(/<.*?>/g, " ").replace(/\s+/g, " ").trim();

      Locations.update(_id, {$set: {
        title: strippedTitle,
        imageUrl: data.imageUrl
      }});
    },
    'locations.applychanges'(_id, changes) {

      // Make sure the user is logged in
      if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

      var context =  LocationsSchema.newContext();
      if(context.validate({ $set: changes}, {modifier: true} )) {
        var location = Locations.findOne(_id);

        // log original values as well
        var logchanges = {};
        Object.keys(changes).forEach((fieldname) => {
          // convert dot notation to actual value
          val = new Function('_', 'return _.' + fieldname)(location);
          logchanges[fieldname] = { new: changes[fieldname],
                                    prev: val||'undefined' };
        });

        Locations.update(_id, {$set : changes} );

        var description = getUserDescription(Meteor.user()) + ' heeft de instellingen van locatie ' + location.title + ' gewijzigd';
        Meteor.call('transactions.addTransaction', 'CHANGESETTINGS_LOCATION', description, Meteor.userId(), _id, null, JSON.stringify(logchanges));
      } else {
        console.log('unable to update location with id ' + _id);
        console.log(context);
      };
    },
    'locations.remove'(_id){
      // remove this location from the 'profile.provider_locations' list for all users
      Meteor.users.update({}, {$pull: {'profile.provider_locations': _id}});

      var location = Locations.findOne(_id);
      if(location) {
        Locations.remove(_id);

        var description = getUserDescription(Meteor.user()) + ' heeft locatie ' + location.title + ' verwijderd';
        Meteor.call('transactions.addTransaction', 'REMOVE_LOCATION', description, Meteor.userId(), _id, null, location);

        var slackmessage = 'Locatie ' + location.title + ' is verwijderd';
        Integrations.slack.sendNotification(slackmessage);
      } else {
        console.log('unknown location' + _id);
      }
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

          var description = getUserDescription(Meteor.user()) + ' heeft gebruiker ' + emailaddress + ' toegevoegd als beheerder';
          var location = Locations.findOne(locationId, {title: 1});
          if(location) {
            description += ' voor locatie ' + location.title;
          }

          Meteor.call('transactions.addTransaction', 'ADD_LOCATIONADMIN', description, Meteor.userId(), locationId, null, {'locationId': locationId, 'emailaddress': emailaddress, 'userid': daUser._id});
        } else {
          throw new Meteor.Error('No user exists with email: ' + emailaddress, 'locationprovider.addUser: No user exists with email: ' + emailaddress);
        }
      }
    },
    'locationprovider.removeuser'(locationId, userId) {
      // given user is removed as provider for the given location
      if(locationId&&userId) {
        Meteor.users.update({_id: userId}, {$pull: {'profile.provider_locations': locationId}});

        var user = Meteor.users.findOne(userId);

        var description = getUserDescription(Meteor.user()) + ' heeft gebruiker ' + getUserDescription(user) + ' verwijderd als beheerder';
        var location = Locations.findOne(locationId, {title: 1});
        if(location) {
          description += ' voor locatie ' + location.title;
        }

        Meteor.call('transactions.addTransaction', 'REMOVE_LOCATIONADMIN', description, Meteor.userId(), locationId, null,
                    {'locationId': locationId, 'user': getUserDescription(user), 'userid': userId});
      }
    },
    // 'currentuser.update_avatar'(new_avatar_url) {
    //   if(this.userId) {
    //     Meteor.users.update(this.userId, {$set : { 'profile.avatar' : new_avatar_url }});
    //   }
    // }
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
