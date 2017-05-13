import { getSettingsServerSide } from '/imports/api/settings.js'; 

if (Meteor.isServer) {
  export const Integrations = {
    slack: {
      sendNotification: function(notification) {
        var settings = getSettingsServerSide();
        var slack = settings.slack;
        if(!slack.notify) { return }

        const payload = JSON.stringify({ "channel": "#" + slack.channel,
                                          "username": slack.name,
                                          "text": notification,
                                          "icon_emoji": slack.icon_emoji
                                      })
        HTTP.post(slack.address, {
          "params": { 
            "payload": payload 
          }
        });
      }
    } // end of slack
  } // end of Integrations
} // else !Meteor.isServer
