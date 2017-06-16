import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base'

export const Log = new Mongo.Collection('log');

LogSchema = new SimpleSchema({
  timestamp: {
    type: String,
    label: "Timestamp",
    optional: false
  },
  datetime: {
    type: String,
    label: "Timestring",
    optional: false
  },
  message: {
    type: String,
    label: "Descripion",
    optional: false
  },
  data: {
    type: String,
    label: "data",
    optional: true,
  }
});

if (Meteor.isServer) {

  export const logwrite = function (description, extraData) {
    console.log('LOG:' + description);

    var timestamp = new Date();
    var id = Log.insert({timestamp: timestamp,datetime: timestamp.toISOString(), description: description, data: extraData});
  }

  Meteor.publish('log', function logPublication() {
    if (!this.userId) {
        return this.ready();
    }

  	return Roles.userIsInRole( this.userId, 'admin' ) ? Log.find() : [];
  });

	Meteor.methods({
    'log.clear'() {
        if (!Meteor.userId()||!Roles.userIsInRole( Meteor.userId(), 'admin' )) throw new Meteor.Error('not-authorized');

        Log.remove({});

        var description = getUserDescription(Meteor.user()) + ' heeft het log gewist';
        Meteor.call('log.write', 'CLEAR_LOG', description, null);
    },
   	'log.write'(description, extraData) {
        console.log('LOG:' + description);

  		  var timestamp = new Date();

  		  var id = Log.insert({timestamp: timestamp,datetime: timestamp.toISOString(), description: description, data: extraData});

  		  return id;
  	}
  })
}
