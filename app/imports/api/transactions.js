import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'
import { Locations } from '/imports/api/locations.js'; 
import { Objects } from '/imports/api/objects.js'; 
import { getUserDescription } from '/imports/api/users.js'; 
import { Integrations } from '/imports/api/integrations.js'; 

export const Transactions = new Mongo.Collection('transactions');

TransactionsSchema = new SimpleSchema({
  timestamp: {
    type: Date,
    label: "Timestamp",
    optional: false
  },
  transactionType: {
    type: String,
    label: "Type",
    optional: false
  },
  description: {
    type: String,
    label: "Descripion",
    max: 2,
    optional: false
  },
  userId: {
    type: String,
    label: "user Id",
    optional: true,
  },
  objectId: {
    type: String,
    label: "object Id",
    optional: true,
  },
  locationId: {
    type: String,
    label: "location Id",
    optional: true,
  },
  data: {
    type: String,
    label: "data",
    optional: true,
  }
});

if (Meteor.isServer) {
  Meteor.publish('transactions', function transactionsPublication() {
    if (!this.userId) {
        return this.ready();
    }

  	return Transactions.find(
      Roles.userIsInRole( this.userId, 'admin' )
        ? {}
        : {userId: this.userId}
      , {timestamp: -1});
  });

	Meteor.methods({
    'transactions.clearAll'() {
        if (!Meteor.userId()||!Roles.userIsInRole( Meteor.userId(), 'admin' )) throw new Meteor.Error('not-authorized');

        Transactions.remove({});

        var description = getUserDescription(Meteor.user()) + ' heeft de transactiehistorie gewist';
        Meteor.call('transactions.addTransaction', 'CLEAR_TRANSACTIONS', description, Meteor.userId(), null, null, null);    
    },
   	'transactions.addTransaction'(type, description, userid, locationid, objectid, extraData) {
  		  var timestamp = new Date();

  		  var id = Transactions.insert({timestamp: timestamp.valueOf(), transactionType: type, 
  		                                userId: userid, locationId: locationid, objectId: objectid, 
  		                                description: description + ' [' + timestamp.toGMTString() + ']',
                                      data: extraData}); 

  		  return id;
  	},
  	'transactions.registerUser'(userid) {
  	  var userData = Meteor.users.findOne({_id:userid});
  		var description ="nieuwe gebruiker " + userData.emails[0].address + " geregistreerd";
  		Meteor.call('transactions.addTransaction', 'NEWUSER', description, userid, null, null, null)
  	},
  	'transactions.changeStateForObject'(newstate, actiondescription, objectid, locationid) {
  		var userid = Meteor.userId();
      if(userid&&userid!=null) {
        var userdata = Meteor.users.findOne({_id:userid}, {emails:1});
        userDescription = userdata.emails[0].address;
      } else {
        userDescription = "anoniem";
      }
      if(locationid&&locationid!=null) {
        var locationdata = Locations.findOne({_id: locationid}, {title: 1});
        locationtitle = locationdata.title;
      } else {
        locationtitle = 'onbekend';
      }
      var objectdata = Objects.findOne({_id: objectid}, {title: 1});

  		var description = "gebruiker \'" + userDescription + '\' heeft ' + actiondescription + ' op locatie \'' + locationtitle + '\'';

  		Meteor.call('transactions.addTransaction', 'SET_STATE_' + newstate.toUpperCase(), description, userid, locationid, objectid, null)

      if(newstate=='reserved') {
        Integrations.slack.sendNotification('Fiets '+ objectdata.title + ' is gereserveerd bij ' + locationtitle);
      } else if(newstate=='inuse') {
        Integrations.slack.sendNotification('Fiets '+ objectdata.title + ' is opgehaald bij ' + locationtitle);
      } else if(newstate=='available') {
        Integrations.slack.sendNotification('Fiets '+ objectdata.title + ' is teruggezet bij ' + locationtitle);
      } else if(newstate=='outoforder') {
        Integrations.slack.sendNotification('Fiets '+ objectdata.title + ' is buiten gebruik bij ' + locationtitle);
      }
  	}     
  })
}
