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
});

if (Meteor.isServer) {
  Meteor.publish('objects', function tasksPublication() {
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
  }
});
