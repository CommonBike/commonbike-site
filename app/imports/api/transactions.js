import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'
import { Locations } from '/imports/api/locations.js'; 

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
});

if (Meteor.isServer) {
  Meteor.publish('transactions', function transactionsPublication() {
    if (!this.userId) {
        return this.ready();
    }

  	return Transactions.find({userId: this.userId}, {timestamp: -1});
  });

	Meteor.methods({
	'transactions.addTransaction'(type, description, userid, locationid, objectid) {
		  var timestamp = new Date();

		  var id = Transactions.insert({timestamp: timestamp.valueOf(), transactionType: type, 
		                                userId: userid, locationId: locationid, objectId: objectid, 
		                                description: description + ' [' + timestamp.toGMTString() + ']'}); 

		  return id;
		},
	'transactions.registerUser'(userid) {
	    var userData = Meteor.users.findOne({_id:userid});
		var description ="nieuwe gebruiker " + userData.emails[0].address + " geregistreerd";
		Meteor.call('transactions.addTransaction', 'NEWUSER', description, userid, null, null, null)
		},
	'transactions.changeStateForObject'(newstate, actiondescription, objectid, locationid) {
		var userid = Meteor.userId();
	  var userdata = Meteor.users.findOne({_id:userid}, {emails:1});
	  var locationdata = Locations.findOne({_id: locationid}, {title: 1});

    console.log('userData:', userdata.emails[0].address);
    console.log('locData:', locationdata.title);

		var description = "gebruiker \'" + userdata.emails[0].address + '\' heeft ' + actiondescription + ' op locatie \'' + locationdata.title + '\'';

		Meteor.call('transactions.addTransaction', 'SET_STATE_' + newstate.toUpperCase(), description, userid, locationid, objectid, null)
		},
	});
}

