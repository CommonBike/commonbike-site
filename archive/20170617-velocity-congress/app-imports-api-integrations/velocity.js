// These options were added temporarily for the velocity congress:
// - onboarding check with bikepasspartout backend (Implemented by BimBim bikes)
// - auto registration of user when whitelisted

// import { getSettingsServerSide } from '/imports/api/settings.js';
// export const VelocitySchema = new SimpleSchema({
// 	'enabled': {
//     type: Boolean,
//     label: "velocity.enabled",
//     defaultValue: 'false'
//   },
// 	'token': {
//     type: String,
//     label: "velocity.token",
//     defaultValue: '<fill in token here>'
//   }
// });
// new settings:
// velocity : {
//   enabled:false,
//   token: ''
// },
// update settings:

//
// if(Meteor.isServer) {
//   gVelocityAPIURL = 'https://bikepassepartout.com/api/registration';
//
//   class VelocityAPIClass {
//     constructor() {
//       // var settings = getSettingsServerSide().velocity;
//       // console.log('settings', settings);
//       this.enabled = false ; //settings.enabled;
//   	}
//
//     checkUserEmailAddress(emailAddress) {
//       try {
//         if( ! this.enabled) {
//           console.log('VeloCity onboarding is disabled');
//           return false;
//         }
//
//         var SHA256 = require("crypto-js/sha256");
//         var url = gVelocityAPIURL + '/' + SHA256(emailAddress.toLowerCase()).toString().toLowerCase();
//
//         console.log('validating @ ' + url + '');
//
//         var response = HTTP.get(url, {
//           "headers": {
//             "token": getSettingsServerSide().velocity.token
//           }
//         });
//
//         if(response.statusCode==200) {
//           content = JSON.parse(response.content);
//
//           console.log('Velocity email check response: OK');
//           console.log(JSON.stringify(content,0,4));
//           return true;
//         } else if (response.statusCode==404) {
//           content = JSON.parse(response.content);
//
//           console.log('Velocity email check response: Unknown user' );
//           console.log(JSON.stringify(content,0,4));
//           return false;
//         } else if (response.statusCode==403) {
//           console.log('Velocity unable to check email address. Status code ' + response.statusCode + ' - token is missing / invalid' );
//           return false;
//         } else {
//           console.log('Velocity unable to check email address. Status code ' + response.statusCode);
//           return false;
//         }
//       } catch(ex) {
//           console.log('Velocity auth exception:', JSON.stringify(ex));
//           return false;
//       }
//     }
//   }
//
//   export const VelocityAPI = new VelocityAPIClass()
//
//   Meteor.methods( {
//     'velocity.checkuser'(user_email) {
//       return VelocityAPI.checkUserEmailAddress(user_email)
//     }
//   });
// }

// From users:
// import { VelocityAPI } from '/imports/api/integrations/velocity.js'
//
// // Validate username, sending a specific error message on failure.
// Accounts.validateNewUser((user) => {
//   if(user.emails && user.emails.length>0 && user.emails[0].address) {
//     user_email = user.emails[0].address;
//     user_pass = user.services.password
//   }
//
//   else {
//     return false;
//   }
//
//   // If VeloCity onboarding is not enabled: user is validated by default
//   if ( ! getSettingsServerSide().velocity.enabled) {
//     return true;
//   }
//
//   // If VeloCity onboarding is enabled: check if email address is on the list
//   else {
//     return VelocityAPI.checkUserEmailAddress(user_email)
//   }
// });
//
// Accounts.onCreateUser((options, user) => {
//   // We still want the default hook's 'profile' behavior.
//   user.profile = options.profile || {};
//
//   if(getSettingsServerSide().onboarding.enabled||getSettingsServerSide().velocity.enabled) {
//     user.profile.active = true;
//   }
//
//   return user;
// });
//
// From the EditSettings component:
// {
//     controltype: 'header',
//     label: 'Velocity Options'
// },
// {
//     fieldname: 'velocity.enabled',
//     fieldvalue: this.props.settings.velocity.enabled,
//     label: 'Enabled',
//     controltype: 'yesno'
// },
// {
//     fieldname: 'velocity.token',
//     fieldvalue: this.props.settings.velocity.token,
//     controltype: 'text',
//     label: 'Onboarding Token'
// },
