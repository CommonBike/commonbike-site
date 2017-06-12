import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { getUserDescription } from '/imports/api/users.js';

export const Settings = new Mongo.Collection('settings');

const latestSettingsVersion = 1;		// FUTURE: for automatic update of settings later on
export const defaultProfileName = 'default';   // FUTURE: multiple profiles

// set fields/objects that are also visible to the client here
const publicFieldset = {profileName:1, mapbox:1, veiligstallen:1, gps: 1};

if (Meteor.isServer) {
	Meteor.publish('settings', function settingsPublication(profileName) {
		if(!profileName) {
			profileName=defaultProfileName
		}

		if(Roles.userIsInRole( this.userId, 'admin' )) {
			return Settings.find({profileName: profileName});
		} else {
			return Settings.find({profileName: profileName}, {fields: publicFieldset});
		}
	});

	// use this function serverside to get all settings
	export const getSettingsServerSide = function(profileName) {
		if(!profileName) {
			profileName=defaultProfileName
		}

		var settings = Settings.findOne({profileName: profileName});

		if(!settings) {
			Meteor.call('settings.check');

			settings = Settings.findOne({profileName: profileName});
		}

		return Settings.findOne({profileName: profileName});
	}
}

export const MapboxSchema = new SimpleSchema({
  'style': {
    type: String,
    label: "mapbox.style",
    defaultValue: 'mapbox.streets'
  },
  'userId': {
    type: String,
    label: "mapbox.accessToken",
    // defaultValue: '<fill in mapbox access token here>'
    defaultValue: 'pk.eyJ1IjoiZXJpY3ZycCIsImEiOiJjaWhraHE5ajIwNmRqdGpqN2h2ZXhqMnRsIn0.1FBWllDyQ_nSlHFE2jMLDA'
  }
});

export const SlackSchema = new SimpleSchema({
  'notify': {
    type: Boolean,
    label: "slack.notify",
    defaultValue: 'false'
  },
  'address': {
    type: String,
    label: "slack.address",
    defaultValue: '<fill in Webhook URL here, channel and name below, set notify to true>'
  },
  'channel': {
    type: String,
    label: "slack.channel",
    defaultValue: 'commonbike-activity'
  },
  'name': {
    type: String,
    label: "slack.name",
    defaultValue: 'commonbike-bot'
  },
  'icon_emoji': {
    type: String,
    label: "slack.icon_emoji",
    defaultValue: ':ghost:'
  }
});

export const VeiligstallenSchema = new SimpleSchema({
  'visible': {
    type: Boolean,
    label: "veiligstallen.visible",
    defaultValue: 'false'
  },
  'kmlURL': {
    type: String,
    label: "veiligstallen.kmlurl",
    defaultValue: 'http://www.veiligstallen.nl/veiligstallen.kml'
  },
  'kmlLastDownloadTimestamp': {
    type: Number,
    label: "veiligstallen.kmllastdownload",
    defaultValue: 0
  }
});

export const OpenBikeLockerSchema = new SimpleSchema({
  'twilio_enabled': {
    type: Boolean,
    label: "openbikelocker.twilio_enabled",
    defaultValue: 'false'
  },
  'twilio_accountsid': {
    type: String,
    label: "openbikelocker.twilio_accountsid",
    defaultValue: ''
  },
  'twilio_authtoken': {
    type: String,
    label: "openbikelocker.twilio_authtoken",
    defaultValue: ''
  },
	'twilio_fromnumber': {
    type: String,
    label: "openbikelocker.twilio_fromnumber",
    defaultValue: ''
  }
});

export const OnboardingSchema = new SimpleSchema({
  'enabled': {
    type: Boolean,
    label: "onboarding.enabled",
    defaultValue: 'true'
  }
});

export const BackupSchema = new SimpleSchema({
  'location': {
    type: String,
    label: "Backup Location",
    defaultValue: '~/backup-commonbike'
  }
});

export const SkopeiSchema = new SimpleSchema({
	'enabled': {
    type: Boolean,
    label: "skopei.enabled",
    defaultValue: 'false'
  },
	'clientid': {
    type: String,
    label: "skopei.clientid",
    defaultValue: '<fill in client id here, client key below, set enable to true>'
  },
	'clientkey': {
    type: String,
    label: "skopei.clientkey",
    defaultValue: ''
  },
});

export const VelocitySchema = new SimpleSchema({
	'enabled': {
    type: Boolean,
    label: "velocity.enabled",
    defaultValue: 'false'
  },
	'token': {
    type: String,
    label: "velocity.token",
    defaultValue: '<fill in token here>'
  }
});

export const GoAboutSchema = new SimpleSchema({
	'enabled': {
    type: Boolean,
    label: "goabout.enabled",
    defaultValue: 'false'
  },
	'clientid': {
    type: String,
    label: "goabout.clientid",
    defaultValue: '<fill in client id here, client secret / usertoken below, set enable to true>'
  },
	'clientsecret': {
    type: String,
    label: "goabout.clientsecret",
    defaultValue: ''
  },
	'userbearertoken': {
    type: String,
    label: "goabout.userbearertoken",
    defaultValue: ''
  },
});

export const GPSSchema = new SimpleSchema({
	'enabled': {
    type: Boolean,
    label: "gps enabled",
    defaultValue: 'false'
  },
	lat_lng: {
    type:   Array,
    label: "GPS location",
    maxCount: 2
  },
  'lat_lng.$': {
    type: Number,
    decimal: true,
    optional: true
  }
});


// for now there is only one set of settings. Later on profilename can be used later
// to use different settings for different instances

export const SettingsSchema = new SimpleSchema({
  _id: {
  	type: String,
  },
  profileName: {
    type: String,
    label: "profile name",
    defaultValue: 'standard'
  },
  version: {
    type: Number,
    label: "settings structure version",
    defaultValue: latestSettingsVersion
  },
  mapbox: {
    type: MapboxSchema
  },
  slack: {
    type: SlackSchema
  },
  veiligstallen: {
  	type: VeiligstallenSchema
  },
	openbikelocker: {
  	type: OpenBikeLockerSchema
  },
	onboarding: {
		type: OnboardingSchema
  },
	backup: {
    type: BackupSchema
  },
	skopei: {
    type: SkopeiSchema
  },
	velocity: {
    type: VelocitySchema
  },
	goabout: {
    type: GoAboutSchema
  },
	bikecoin: {				// ignore this: is used in bikecoin branch
		type: Object,
		blackbox: true
  },
	gps: {
    type: GPSSchema
  },
});

if (Meteor.isServer) {
	Meteor.methods({
	  'settings.check'() {
	    // Make sure this runs serverside only
	    if ( ! Meteor.isServer) throw new Meteor.Error('not-authorized');

			if(Meteor.users.find().fetch().length==0) {
				Accounts.createUser({
				                            username: 'commonbike-admin',
				                            email : 'info@common.bike',
				                            password : 'commonbike-admin-!!##',
				                            profile  : {
				                                active: true
				                            }
				    });
			}

	    // for now there is only one settings profile
		  var settings = Settings.findOne({profileName: defaultProfileName});
	    if( !settings) {
		    var settingsId = Settings.insert({});
	    	settings = {
	    		_id: settingsId,
	    		profileName: defaultProfileName,
	    		version: latestSettingsVersion,
	    		mapbox: {
					  style: 'mapbox.streets',
					  userId: '<fill in mapbox access token here>'
					},
	    		slack: {
  				  notify:false,
  				  address: '<fill in Webhook URL here, channel and name below, set notify to true>',
  				  channel: 'commonbike-activity',
  				  name: 'commonbike-bot',
  				  icon_emoji: ':ghost:'
	    		},
	    		veiligstallen: {
  				  visible:false,
  				  kmlURL: '<fill in Webhook URL here, channel and name below, set notify to true>',
  				  kmlLastDownloadTimestamp: 0
	    		},
					openbikelocker: {
						twilio_enabled:false,
						twilio_accountsid: "",
						twilio_authtoken: "",
						twilio_fromnumber: ""
					},
					onboarding: {
					  enabled:true
					},
					backup: {
					  location:''
					},
					skopei : {
					  enabled:false,
					  clientid: '',
					  clientkey: ''
					},
					velocity : {
					  enabled:false,
					  token: ''
					},
					goabout : {
					  enabled:false,
					  clientid: '',
					  clientsecret: '',
					  userbearertoken: ''
					},
					bikecoin : {
					  enabled:false,
					  provider_url : '',
					  "token_address" : '',
					  "token_abi" : [],
					  "wallet" : {
					              "address" : '',
					              "privatekey" : ''
					  }
					},
					gps: {
						enabled:true,
						lat_lng: [999,999]
				  },
	    	}

		    try {
		      check(settings, SettingsSchema);
		    } catch(ex) {
		      console.log('data for new settings does not match schema: ' + ex.message);
		      throw new Meteor.Error('invalid-settings');
		      return;
		    }

				Settings.update(settingsId, settings, {validate: false});

		    var description = 'Standaard instellingen aangemaakt';
		    Meteor.call('transactions.addTransaction', 'CREATE_SETTINGS', description, Meteor.userId(), null, null, settings);
	    } else {
				if(!settings.openbikelocker) {
					settings.openbikelocker = {
						twilio_enabled:false,
						twilio_accountsid: "",
						twilio_authtoken: "",
						twilio_fromnumber: ""
					}

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.onboarding) {
					settings.onboarding = {
						enabled:true
					}

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.backup) {
					settings.backup = {
						location:'~/backup-commonbike'
					}

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.skopei) {
					settings.skopei = {
						enabled:false,
						clientid: '',
						clientkey: ''
					}

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.velocity) {
					settings.velocity = {
						enabled:false,
						token: ''
					}

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.goabout) {
					settings.goabout = {
						enabled:false,
						clientid: '',
						clientsecret: '',
						userbearertoken: ''
					}

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.bikecoin) {
					settings.bikecoin = {
						enabled:false,
						provider_url : '',
		        "token_address" : '',
		        "token_abi" : [],
						"wallet" : {
						            "address" : '',
						            "privatekey" : ''
		        }
					}

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.gps) {
					settings.gps = {
						enabled:true,
						lat_lng: [999,999]
					}

					Settings.update(settings._id, settings, {validate: false});
				}

		    try {
		      check(settings, SettingsSchema);
		    } catch(ex) {
		      console.log('data for settings does not match schema: ' + ex.message);
			  	throw new Meteor.Error('invalid-settings');
		    }
	    }
	  },
	  'settings.update'(settingsId, settings) {
	    // Make sure an adminuser is logged in
	    if(!Meteor.userId()||!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
	    	 throw new Meteor.Error('not-authorized');
	    }

	    try {
	      check(settings, SettingsSchema);
	    } catch(ex) {
	      console.log('data for new settings does not match schema: ' + ex.message);
	  	  throw new Meteor.Error('schema-error');
	    }

			Settings.update(settingsId, settings, {validate: false});

	    var description = getUserDescription(Meteor.user()) + ' heeft de instellingen van profiel ' + settings.profileName + ' gewijzigd';
	    Meteor.call('transactions.addTransaction', 'CHANGE_SETTINGS', description, Meteor.userId(), null, null, settings);
	  },
	  'settings.applychanges'(_id, changes) {
		  // Make sure the user is logged in
		  if (! Meteor.userId()) throw new Meteor.Error('not-authorized');

			var context =  SettingsSchema.newContext();
			if(context.validate({ $set: changes}, {modifier: true} )) {
        var oldsettings = Settings.findOne(_id);

        // log original values as well
        var logchanges = {};
        Object.keys(changes).forEach((fieldname) => {
          // convert dot notation to actual value
          val = new Function('_', 'return _.' + fieldname)(oldsettings);
          logchanges[fieldname] = { new: changes[fieldname],
          	                        prev: val||'undefined' };
        });

				Settings.update(_id, {$set : changes} );

        var description = getUserDescription(Meteor.user()) + ' heeft de systeeminstellingen gewijzigd';
        Meteor.call('transactions.addTransaction', 'CHANGESETTINGS_SYSTEMSETTINGS', description, Meteor.userId(), null, null, JSON.stringify(logchanges));
			};
    },
	});

	Meteor.startup(() => {
		Meteor.call('settings.check');
	});
}
