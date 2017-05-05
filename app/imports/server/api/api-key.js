import { APIKeys } from '/imports/api/api-keys.js'; 

Meteor.methods({
  getAPIKeysList(ownerId, type) {
    // return a list of users that are providers for the given location 
    // - providers are maintained as a location id list ('profile.provider_locations') 
    // in the user document
    var daKeys = APIKeys.find({type: type, ownerid: ownerId }).fetch();
    if(daKeys) {
      return daKeys;
    } else {
      return [];
    }
  },
  addApiKey: function( ownerId, type, name ) {
    // check( type, Match.OneOf( {'user', 'object', 'location'}), String ) );
    // check( name, Match.Optional(String));

    if(type=='user') {
      check( ownerId, Match.OneOf( Meteor.userId(), String ) );
    } else if(type=='object') {
      // must be manager for object
    } else if(type=='location') {
      // must be manager for location
    }

    var newKey = Random.hexString( 32 );
    if(!name) {
      name = type + '_' + newKey.slice(0,4)
    }

    try {
       var key = APIKeys.insert({
        "ownerid": ownerId,
        "type": type,
        "name": name,
        "key": newKey
       });

      Meteor.call('log.write', `User ${this.userId} added ${type} API key with owner ID ${ownerId} and name ${name}`);

       return key;
    } catch( exception ) {
      Meteor.call('log.write', `User ${this.userId} failed to add ${type} API key with owner ID ${ownerId} and name ${name} - reason: ${exception}`);

      return exception;
    }
  },

 // 'locationprovider.adduser'(locationId, emailaddress) {
 //    // given user is added as provider for the given location
 //    if(locationId&&emailaddress) {
 //      var daUser = Accounts.findUserByEmail(emailaddress);
 //      if(daUser) {
 //        Meteor.users.update({_id: daUser._id}, {$addToSet: {'profile.provider_locations': locationId}});

 //        var description = getUserDescription(Meteor.user()) + ' heeft gebruiker ' + emailaddress + ' toegevoegd als beheerder';
 //        var location = Locations.findOne(locationId, {title: 1});
 //        if(location) {
 //          description += ' voor locatie ' + location.title;
 //        }

 //        Meteor.call('transactions.addTransaction', 'ADD_LOCATIONADMIN', description, Meteor.userId(), locationId, null, {'locationId': locationId, 'emailaddress': emailaddress, 'userid': daUser._id});    
 //      } else {
 //        throw new Meteor.Error('No user exists with email: ' + emailaddress, 'locationprovider.addUser: No user exists with email: ' + emailaddress);
 //      }
 //    }
 //  },
 //  'locationprovider.removeuser'(locationId, userId) {
 //    // given user is removed as provider for the given location
 //    if(locationId&&userId) {
 //      Meteor.users.update({_id: userId}, {$pull: {'profile.provider_locations': locationId}});

 //      var user = Meteor.users.findOne(userId);

 //      var description = getUserDescription(Meteor.user()) + ' heeft gebruiker ' + getUserDescription(user) + ' verwijderd als beheerder';
 //      var location = Locations.findOne(locationId, {title: 1});
 //      if(location) {
 //        description += ' voor locatie ' + location.title;
 //      }

 //      Meteor.call('transactions.addTransaction', 'REMOVE_LOCATIONADMIN', description, Meteor.userId(), locationId, null,
 //                  {'locationId': locationId, 'user': getUserDescription(user), 'userid': userId});    
 //    }
 //  },

});

// Meteor.startup(() => {
//   Meteor.call('addApiKey', "x8yKndwd7pcsDpoys", "user");
//   Meteor.call('addApiKey', "x8yKndwd7pcsDpoys", "object");
//   Meteor.call('addApiKey', "x8yKndwd7pcsDpoys", "location");
//   // Meteor.call('addObjectApiKey', "", "ahT77YFWxTR9QrEWm");
// })