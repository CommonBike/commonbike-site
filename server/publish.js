Meteor.publish("userList", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});
