import { Settings } from '/imports/api/settings.js';
import { Objects } from '/imports/api/objects.js';

// const getContent = function(url) {
//   // return new pending promise
//   return new Promise((resolve, reject) => {
//     // select http or https module, depending on reqested url
//     const lib = url.startsWith('https') ? require('https') : require('http');
//     const request = lib.get(url, (response) => {
//       // handle http errors
//       if (response.statusCode < 200 || response.statusCode > 299) {
//          reject(new Error('Failed to load page, status code: ' + response.statusCode));
//        }
//       // temporary data holder
//       const body = [];
//       // on every content chunk, push it to the data array
//       response.on('data', (chunk) => body.push(chunk));
//       // we are done, resolve promise with those joined chunks
//       response.on('end', () => resolve(body.join('')));
//     });
//     // handle connection errors of the request
//     request.on('error', (err) => reject(err))
//     })
//   };
// getContent('https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new')
//   .then((html) => {
//     Meteor.call('log.write', 'made successful callout call to ' + callbackURL)
//     Meteor.call('log.write', html)
//     return true;
//   }).catch((err) => {
//     Meteor.call('log.write', 'unable to make wakeup call to object ' + object.title + ' [id:' + object._id + '] - '.JSON.stringify(error));
//     return false;
//   });
// } else {
// Meteor.call('log.write', 'unable to make wakeup call to object ' + object.title + ' [id:' + object._id + '] - No callback set');
// return false;


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

        var callbackURL = object.lock.settings.callbackurl||'';
        if(callbackURL!='') {
          const request = require('request');

          Meteor.call('log.write', 'start wakeup call to object ' + object.title + ' [id:' + object._id + '] ');
          request(callbackURL, { json: true }, (err, res, body) => {
            if (err) {
              // Meteor.call('log.write', 'unable to make wakeup call to object ' + object.title + ' [id:' + object._id + '] - '.err);
              return false;
            }

            // Meteor.call('log.write', 'made successful callout call to ' + callbackURL)
            // Meteor.call('log.write', html)
            // console.log(body.url);
            // console.log(body.explanation);
            return true;
          });

          return true;
        }
      }
    })
}
