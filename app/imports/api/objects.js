import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';

export const Objects = new Mongo.Collection('objects');

ObjectsSchema = new SimpleSchema({
  locationId: {
    type: String,
    label: "Location"
  },
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
  },
  imageUrl: {
    type: String,
    label: "Image URL",
    optional: true,
    max: 1000
  },
  'state.state': {
    type: String,
    label: "State",
    optional: false
  },
  'state.userId': {
    type: String,
    label: "userId",
    optional: false
  },
  'state.timestamp': {
    type: Date,
    label: "timestamp",
    optional: false
  }
});

if (Meteor.isServer) {
  Meteor.publish('objects', function objectsPublication() {
    return Objects.find();
  });
}

Meteor.methods({
  'objects.insert'(data) {

    // Make sure the user is logged in
    if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

    // check(data, ObjectsSchema);

    Objects.insert({
      locationId: data.locationId,
      title: data.title,
      imageUrl: data.imageUrl
    });
  },
  'objects.update'(_id, data) {

    // Make sure the user is logged in
    if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

    // check(data, ObjectsSchema);

    Objects.update(_id, {
      locationId: data.locationId,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl
    });
  },
  'objects.remove'(_id){
    Objects.remove(_id);
  },
  'objects.setState'(objectId, userId, newState){
    // Make sure the user is logged in
    if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

    console.log('setState(' + objectId + ", " + userId + ", " + newState + ")" );

    var timestamp = new Date().valueOf();
    Objects.update({_id: objectId}, { $set: {
        'state.userId': userId,
        'state.state': newState,
        'state.timestamp': timestamp }
    });

    return;
  },
  // 'objects.setStateInUse'(_id, userId){
  //   // Make sure the user is logged in
  //   if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

  //   var timestamp = new Date().valueOf();
  //   Objects.update(_id, {
  //     'state.userId': userId,
  //     'state.state': 'inuse',
  //     'state.timestamp': timestamp
  //   });
  // }
  // 'objects.setStateAvailable'(_id, userId){
  //   Objects.update(_id, {
  //     'state.userId': userId,
  //     'state.state': 'inuse',
  //     description: data.description,
  //     imageUrl: data.imageUrl
  //   });
  // },
  // 'objects.setStateOutOfOrder'(_id, userId){
  // }
});
