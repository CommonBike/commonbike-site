import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

import '/imports/api/users.js'
import { Locations, toGeoJSONPoint, Address2GeoJSONPoint } from '/imports/api/locations.js';
import { Objects } from '/imports/api/objects.js';
import { Settings } from '/imports/api/settings.js';
import '/imports/api/api-keys.js'
import { Log } from '/imports/api/log.js'
import '/imports/server/testdata.js'
import '/imports/api/databasetools.js';
import '/imports/api/integrations/goabout.js';
import '/imports/api/integrations/velocity.js';

Meteor.startup(() => {
	// code to run on server at startup

	// fix all 'old' objects in the production database
	if(false) {
		var myObjects = Objects.find().fetch();
		_.each(myObjects, function (objectData) {

		    var timestamp =  new Date().valueOf();
		    var length = 5;
		    var base = Math.pow(10, length+1);
		    var code = Math.floor(base + Math.random() * base)
		    var keycode = code.toString().substring(1, length+1);

			if(!objectData.state) {
			    Objects.update(objectData._id, {$set:{
			      state: {state: 'available',
	              		  userId: null,
	                      timestamp: timestamp}
			    }});
			}

			if(!objectData.lock) {
			    Objects.update(objectData._id, {$set:{
			      lock: {type: 'plainkey',
			             settings: {keyid: keycode }
			         }
			    }});
			}
		});

		var myUsers = Meteor.users.find().fetch();
		_.each(myUsers, function (user) {
			if(!user.profile || !user.profile.active) {
				Meteor.users.update(user._id, {$set : { 'profile.active' : false }});
			}
			if(!user.profile || !user.profile.name) {
				Meteor.users.update(user._id, {$set : { 'profile.name' : 'anonymous' }});
			}
			if(!user.profile || !user.profile.avatar) {
				Meteor.users.update(user._id, {$set : { 'profile.avatar' : '' }});
			}
		});
	}

	// move price from hardcoded to object
	if(false) {
		var newprice = {
			value: '0',
			currency: 'euro',
			timeunit: 'day',
			description: 'tijdelijk gratis'
		};

		var myObjects = Objects.find().fetch();
		_.each(myObjects, function (objectData) {
			if(!objectData.price||!!objectData.price.value||
			   !objectData.price.currency||!!objectData.price.timeunit||
			   !objectData.description ) {
			    Objects.update(objectData._id, {$set:{ price: newprice }});

			    var desc = 'price set to ' + newprice.description + ' for ' + objectData.title;
				Meteor.call('transactions.addTransaction', 'SET_PRICE', desc, null, null, objectData._id);
			}
		});
	}

	if(true) {
		// convert all locations to use geoJSON for coordinates
		var myLocations = Locations.find().fetch();
		_.each(myLocations, function (locationData) {
			if(locationData.coordinates) {
				console.log('convert location to geoJSON for ' + locationData.title)

				var geoJSON = toGeoJSONPoint(locationData.lat_lng[0], locationData.lat_lng[1]);
		    Locations.update(locationData._id, {$set:{ coordinates: geoJSON }});

		    var desc = 'geoJSON location set for ' + locationData.title;
				Meteor.call('transactions.addTransaction', 'SET_GEOLOC', desc, null, locationData._id,null);
			}
		});

		// add index to objects/ collection
		Locations._ensureIndex({'loc.coordinates':'2dsphere'});

		// convert all locations to use geoJSON for coordinates
		var myObjects = Objects.find().fetch();
		_.each(myObjects, function (objectData) {
			if(!objectData.coordinates) {
				console.log('convert object coordinates to geoJSON for ' + objectData.title)

				var geoJSON;
				if(objectData.lat_lng) {
				 	geoJSON = toGeoJSONPoint(objectData.lat_lng[0], objectData.lat_lng[1]);
				} else {
					geoJSON = toGeoJSONPoint(-999,-999);
				}
		    Objects.update(objectData._id, {$set:{ coordinates: geoJSON }});

		    var desc = 'geoJSON location set for ' + objectData.title;
				Meteor.call('transactions.addTransaction', 'SET_GEOLOC', desc, null, null, objectData._id);
			}
		});

		var loc = Address2GeoJSONPoint('lekplantsoen 29, 3522GL Utrecht');
		var loc = Address2GeoJSONPoint('asdfasdfasdf asdf asdfa sdf adf');
		var loc = Address2GeoJSONPoint();
	}
});

Meteor.methods( {
  'login.finduser'(email) {
    var daUser = Accounts.findUserByEmail(email);
    if(daUser) {
      return [daUser];
    } else {
      return [];
    }
  }
});
