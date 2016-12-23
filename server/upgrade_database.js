import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Locations } from '/imports/api/locations.js'

var administrators = ['mosbuma@bumos.nl']

function registerAdministrators() {
	_.each(administrators, function (email) {
		var daUser = Accounts.findUserByEmail(email);
		if(daUser) {
			if (!Roles.userIsInRole(daUser._id, ['admin'])) {
			  Roles.addUsersToRoles(daUser._id, ['admin']);
			}
		}
	});
}

function fixLocationsWithoutProviders() {
	// find all locations that have no provider assigned
	// assign all users with admin role to these locations as provider
	//
	// used to update production database for new administration features

	var locations = Locations.find({}, {fields: {_id:1, title:1}}).fetch();
	var admins = Roles.getUsersInRole('admin').fetch();
	_.each(locations, function (location) {
		// filter: find all users that manage location with given id 
		var filter = {admin_locations: {$in: [location._id]}};
		var adminsforlocId = Meteor.users.find(filter, {fields: {_id:1}}).fetch();
		if(adminsforlocId.length==0) {
			_.each(admins, function (admin) {
				console.log('added provider ' +  admin.emails[0].address + ' to location ' + location.title);
          		Meteor.users.update({_id: admin._id}, {$addToSet: {admin_locations: location._id}});
			})
		}
	});
}

/* Uncomment the code below if you want to upgrade the production database when 
   the application starts */
Meteor.startup(() => {
	registerAdministrators();

	fixLocationsWithoutProviders();
})