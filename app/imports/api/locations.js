import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';

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
  imageUrl: {
    type: String,
    label: "Image URL",
    optional: true,
    max: 1000
  },
});


if (Meteor.isServer) {
  Meteor.publish('locations', function tasksPublication() {
    return Locations.find();
  });
}

Meteor.methods({
  'locations.insert'(data) {

    // Make sure the user is logged in
    if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

    // check(data, LocationsSchema);

    Locations.insert({
      title: data.title
    });
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
    Locations.remove(_id);
  }
});
