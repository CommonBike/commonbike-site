import { getSettingsServerSide } from '/imports/api/settings.js';

gVelocityAPIURL = 'https://bikepassepartout.com/api/registration';

class VelocityAPIClass {
  constructor() {
    var settings = getSettingsServerSide().velocity;
    this.enabled = settings.enabled;
    console.log(this.enabled);
	}

  checkUserEmailAddress(emailaddress) {
    try {
      if(!this.enabled) {
        console.log('velocity onboarding is disabled');
        return;
      }

      var SHA256 = require("crypto-js/sha256");
      var url = gVelocityAPIURL + '/' + SHA256(emailaddress.toLowerCase()).toString().toLowerCase();

      console.log('validating @ ' + url + '');

      var response = HTTP.get(url,
        {
          "headers": {
                    "token": getSettingsServerSide().velocity.token
                  }
        }
      );

      if(response.statusCode==200) {
        content = JSON.parse(response.content);

        console.log('Velocity email check response: OK');
        console.log(JSON.stringify(content,0,4));
      } else if (response.statusCode==404) {
        content = JSON.parse(response.content);

        console.log('Velocity email check response: Unknown user' );
        console.log(JSON.stringify(content,0,4));
      } else if (response.statusCode==403) {
        console.log('Velocity unable to check email address. Status code ' + response.statusCode + ' - token is missing / invalid' );
      } else {
        console.log('Velocity unable to check email address. Status code ' + response.statusCode);
      }
    } catch(ex) {
        console.log('Velocity auth exception:', JSON.stringify(ex));
        return false;
    }
  }
}

export const VelocityAPI = new VelocityAPIClass()

Meteor.methods( {
  'velocity.checkuser'(user_email) {
    return VelocityAPI.checkUserEmailAddress(user_email)
  }
});
