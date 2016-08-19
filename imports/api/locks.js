import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
 
export const Locks = new Mongo.Collection('locks');

Meteor.methods({
  'locks.insert'(data) {

    // Make sure the user is logged in
    if (! Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Locks.insert({
      title: data.title,
      isAvailable: data.isAvailable
    });
  },
  'locks.update'(_id, data) {

    // Make sure the user is logged in
    if (! Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Locks.update(_id, {
      title: data.title,
      isAvailable: data.isAvailable
    });
  },
  'locks.remove'(_id){
    Locks.remove(_id);
  }
});