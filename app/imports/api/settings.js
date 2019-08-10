import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { getUserDescription } from '/imports/api/users.js';
import BikeCoin from '/imports/api/bikecoin.js';
import {CoinSchema} from '/imports/api/bikecoinschema.js';

export const Settings = new Mongo.Collection('settings');

const latestSettingsVersion = 1;		// FUTURE: for automatic update of settings later on
export const defaultProfileName = 'default';   // FUTURE: multiple profiles

// set fields/objects that are also visible to the client here
const publicFieldset = {profileName:1, mapbox:1, gps: 1,
												"bikecoin.enabled": 1,
	                      "bikecoin.provider_url": 1,
												"bikecoin.token_address": 1,
												"bikecoin.token_abi": 1	};

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
		if( ! profileName) {
			profileName = defaultProfileName
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

export const OnboardingSchema = new SimpleSchema({
  'enabled': {
    type: Boolean,
    label: "onboarding.enabled",
    defaultValue: 'false'
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

export const CoinSettingsSchema = new SimpleSchema({
	'enabled': {
    type: Boolean,
    label: "bikecoin.enabled",
    defaultValue: 'true'
  },
	'provider_url': {
    type: String,
    label: "bikecoin.provider_url",
    defaultValue: ''
  },
	'token_address': {
    type: String,
    label: "bikecoin.token_address",
    defaultValue: ''
  },
	'token_abi': {
    type: String,
    label: "bikecoin.token_abi",
    defaultValue: ''
  },
	wallet: {
		type: CoinSchema
	}
})

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
	baseurl: {
    type: String,
    label: "base url",
    defaultValue: ''
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
	onboarding: {
		type: OnboardingSchema
  },
	backup: {
    type: BackupSchema
  },
	skopei: {
    type: SkopeiSchema
  },
	goabout: {
    type: GoAboutSchema
  },
	gps: {
    type: GPSSchema
  },
	bikecoin: {
	    type: CoinSettingsSchema
  },
});

if (Meteor.isServer) {
	Meteor.methods({
	  'settings.check'() {
	    // Make sure this runs serverside only
	    if ( ! Meteor.isServer) throw new Meteor.Error('not-authorized');

	    // for now there is only one settings profile
		  var settings = Settings.findOne({profileName: defaultProfileName});
	    if( !settings) {
		    var settingsId = Settings.insert({});
	    	settings = {
	    		_id: settingsId,
	    		profileName: defaultProfileName,
	    		version: latestSettingsVersion,
					baseurl: '',
	    		mapbox: {
					  style: 'mapbox.streets',
					  userId: '<mapbox access token has not been set in system settings>'
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
					onboarding: {
					  enabled:false
					},
					backup: {
					  location:''
					},
					skopei : {
					  enabled:false,
					  clientid: '',
					  clientkey: ''
					},
					goabout : {
					  enabled:false,
					  clientid: '',
					  clientsecret: '',
					  userbearertoken: ''
					},
					gps: {
						enabled:true,
						lat_lng: [999,999]
				  },
					bikecoin: {
						enabled:false,
						provider_url: '',
						token_address: '',
						token_abi: '',
						wallet: {
							address: '',
							privatekey: ''
						}
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
				if(settings.velocity) {
					console.log('remove velocity settings')
					Settings.update(settings._id, {$unset:{ velocity: "" }});
					unset(settings.velocity)
				}

				if(!settings.baseurl) {
					settings.baseurl = '';

					Settings.update(settings._id, settings, {validate: false});
				}

				if(settings.openbikelocker) {
					console.log('remove openbikelocker settings')
					Settings.update(settings._id, {$unset:{ openbikelocker: "" }});
					delete settings.openbikelocker

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.onboarding) {
					settings.onboarding = { enabled: false };

					Settings.update(settings._id, settings, {validate: false});
				}

				if(settings.mapbox.userId.substring(0,3)!='pk.') {
					console.log('setting mapbox userId');
				  settings.mapbox.userId='pk.eyJ1IjoiZXJpY3ZycCIsImEiOiJjaWhraHE5ajIwNmRqdGpqN2h2ZXhqMnRsIn0.1FBWllDyQ_nSlHFE2jMLDA';
					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.backup) {
					settings.backup = {
						location:'~/backup-commonbike'
					}

					Settings.update(settings._id, settings, {validate: false});
				}

				if(!settings.bikecoin) {
					settings.bikecoin = {
						enabled:false,
						provider_url: '',
						token_address: '',
						token_abi: '',
						wallet: {
							address: '',
							privatekey: ''
						}
					}

					console.log('adding bikecoin settings')
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

				if(!settings.goabout) {
					settings.goabout = {
						enabled:false,
						clientid: '',
						clientsecret: '',
						userbearertoken: ''
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
					console.log(JSON.stringify(ex.message));
			  	throw new Meteor.Error('invalid-settings');
		    }
	    }

			// Do settings initialisation below this line. Code above assures that the
			// structures are present in the database, code below should set values
			// so that it works out of the box when doing a fresh installation
			if(settings.bikecoin.provider_url=='') {
				// key generation will fail if there is no provider_url set
				settings.bikecoin.provider_url='https://ropsten.infura.io/sCQUO1V3FOoOUWGZBtig';

				console.log('setting provider URL to ropsten testnet');
				Settings.update(settings._id, settings, {validate: false});	// todo: make net selectable in the configuration
			}

			if(settings.bikecoin.wallet.address=='' && settings.bikecoin.wallet.privatekey=='') {
				var keypair = BikeCoin.newKeypair();
				settings.bikecoin.wallet.address = keypair.address;
				settings.bikecoin.wallet.privatekey = keypair.privatekey;

				console.log('adding bikecoin keypair to general settings')
				Settings.update(settings._id, settings, {validate: false});
			}

			if(Meteor.users.find().fetch().length==0) {
				console.log('create genesis user');

				Accounts.createUser({
						username: 'commonbike-admin',
						email : 'info@common.bike',
						password : 'commonbike-admin-!!##',
						profile  : {
								active: true
						}
				});
			}

			if(Meteor.users.find().fetch().length==1) {
					var user = Meteor.users.find().fetch()[0];
					if(!Roles.userIsInRole(user._id, ["admin"])) {
						console.log('giving user ' + user._id + ' admin role');
						Roles.addUsersToRoles(user._id, ['admin']);
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
