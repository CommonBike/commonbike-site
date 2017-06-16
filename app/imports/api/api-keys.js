import { getUserDescription } from '/imports/api/users.js'; 

export const ApiKeys = new Meteor.Collection( 'api-keys' );

ApiKeys.allow({
  insert: function(){
    // Disallow inserts on the client by default.
    return false;
  },
  update: function(){
    // Disallow updates on the client by default.
    return false;
  },
  remove: function(){
    // Disallow removes on the client by default.
    return false;
  }
});

ApiKeys.deny({
  insert: function(){
    // Deny inserts on the client by default.
    return true;
  },
  update: function(){
    // Deny updates on the client by default.
    return true;
  },
  remove: function(){
    // Deny removes on the client by default.
    return true;
  }
});

if(Meteor.isServer) {
   Meteor.methods({
    'apikeys.getlist'(ownerId, type) {
      var daKeys = ApiKeys.find({type: type, ownerid: ownerId }).fetch();
      if(daKeys) {
        return daKeys;
      } else {
        return [];
      }
    },
    'apikeys.add'( ownerId, type, name ) {
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
         var key = ApiKeys.insert({
          "ownerid": ownerId,
          "type": type,
          "name": name,
          "key": newKey
         });

        var description = getUserDescription(Meteor.user()) + ` heeft een nieuwe ${type} API key toegevoegd met naam  owner ID ${ownerId} en naam ${name}`;
        Meteor.call('transactions.addTransaction', 'API_KEY_CREATE', description, Meteor.userId(), null, null);    

         return key;
      } catch( exception ) {
        var description = getUserDescription(Meteor.user()) + ` kan geen nieuwe ${type} API key toegevoegd met naam  owner ID ${ownerId} en naam ${name} - reden:` + exception;
        Meteor.call('transactions.addTransaction', 'API_KEY_CREATE', description, Meteor.userId(), null, null);    

        return exception;
      }
    },
    'apikeys.remove'(_id) {
      // given user is removed as provider for the given location
      if(_id) {
        var apikey = ApiKeys.findOne(_id);

        if(apikey) {
          ApiKeys.remove(apikey);

          var description = getUserDescription(Meteor.user()) + ` heeft de ${apikey.type} API key verwijderd met naam  owner ID ${apikey.ownerId} en naam ${apikey.name}`;
          Meteor.call('transactions.addTransaction', 'API_KEY_REMOVE', description, Meteor.userId(), null, null);    
        } else {
          console.log('kan key niet verwijderen ' + _id)
        }
      }
    },
  });
}