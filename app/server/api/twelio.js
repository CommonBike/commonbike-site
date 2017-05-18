import { Settings } from '/imports/api/settings.js';
import { Objects } from '/imports/api/objects.js';

// TWIML reference -> https://www.twilio.com/docs/api/twiml
// REST reference -> https://www.twilio.com/docs/api/rest
// node.js 3.0 reference -> https://twilio.github.io/twilio-node/3.0.0-alpha-1/
dialoutTwelio = {
    wakeupCall(serverurl, tophonenumber) {
      // dial number request a status update
      var settings = Settings.findOne({});
      if(!settings.openbikelocker.twilio_enabled) {
        Meteor.call('log.write', 'Twilio Dialout has not been enabled ');
        return false;
      }

      var client = require('twilio')(settings.openbikelocker.twilio_accountsid,
                                     settings.openbikelocker.twilio_authtoken);
      var config = {
          to: tophonenumber,
          from: settings.openbikelocker.twilio_fromnumber,
          timeout: 5,
      };

      // use config from commonbike develop server
      if(serverurl=='localhost:3000') {
        config.url = "http://develop.common.bike/OpenBikeLocker/callinfo.xml";
      } else {
        // use config from this server
        config.url = `http://${serverurl}/OpenBikeLocker/callinfo.xml`;
      }

      config.url = "http://demo.twilio.com/docs/voice.xml";

      client.calls.create(config, function(err, call) {
          // console.log(err || call);
          if(err) {
            // Meteor.call('log.write', 'unable to sent wakeup call to ' + tophonenumber, JSON.stringify(err))
          } else {
            // Meteor.call('log.write', 'sent wakeup call to ' + tophonenumber)
          }
      })
    }
}

if(Meteor.isServer) {
  Meteor.methods({
    'dialoutapi.wakeupcall'(objectId) {
        var settings = Settings.findOne({});
        var object = Objects.findOne({_id: objectId});
        if(!object) {
          Meteor.call('log.write', 'cant call unknown object ' + objectId);
          return false;
        }
        if(object.lock&&object.lock.type!='open-bikelocker') {
          Meteor.call('log.write', 'this object does not need a wakeup call ' + object._id);
          return false;

        }

        var toPhoneNumber = object.lock.settings.phonenr|| '';
        var thisserverurl = this.connection.httpHeaders.host;

        if(toPhoneNumber!='') {
            Meteor.call('log.write', 'making wakeup call to ' + toPhoneNumber)

            dialoutTwelio.wakeupCall(thisserverurl, toPhoneNumber);
        } else {
            Meteor.call('log.write', 'unable to make  wakeup call to object ' + object.title + ' [id:' + object._id + '] - No phonenumber set');
            return false;
        }

        return true;
    }
  });
}
