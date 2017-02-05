import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';

export const Settings = new Mongo.Collection('settings');

const latestSettingsVersion = 1;		// FUTURE: for automatic update of settings later on
const defaultProfileName = 'default';   // FUTURE: multiple profiles

// set fields/objects that are also visible to the client here
const publicFieldset = {profileName:1, mapbox:1, veiligstallen:1};

if (Meteor.isServer) {
	Meteor.publish('settings', function settingsPublication(profileName) {
		if(!profileName) {
			profileName=defaultProfileName
		}

		return Settings.find({profileName: profileName}, {fields: publicFieldset});
	});

	// use this function serverside to get all settings
	export const getSettingsServerSide = function(profileName) {
		if(!profileName) {
			profileName=defaultProfileName
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
  }
});

if (Meteor.isServer) {
	Meteor.methods({
	  'settings.check'() {
	    // Make sure this runs serverside only
	    if ( ! Meteor.isServer) throw new Meteor.Error('not-authorized');

	    // for now there is only one settings profile
		  var settings = Settings.findOne({profileName: defaultProfileName});
	    if( ! settings) {
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
	    		}
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
	  }
	});

	Meteor.startup(() => {
		Meteor.call('settings.check');
	});
}
