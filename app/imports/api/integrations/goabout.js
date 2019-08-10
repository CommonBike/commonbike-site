// import { Objects } from '/imports/api/objects.js';
// import { Locations } from '/imports/api/locations.js';
// import { getSettingsServerSide } from '/imports/api/settings.js';
//
// gGoAboutAPIURL = 'https://api.goabout.com/';
// gGoAboutAuthURL = "https://auth.goabout.com/token";
// gGoAboutAuthUserURL = "https://auth.goabout.com/token";
//
// // NB user bearer token opvragen door inspector in webbrowser openen,
// // in te loggen bij GoAbout (https://goabout.com/)
// // bij network, token message bekijken: hier staat de bearer token in (kan wijzigen in de loop der tijd)
// //
// // evt. later procedure zoals aangegeven in GoAbout API docs gebruiken. zie
// // https://apidocs.goabout.com/tutorial/login.html
//
// // curl -d 'grant_type=client_credentials&client_id=......&client_secret=.....' 'https://auth.goabout.com/token'
//
// // Debuggen: toon headers met
// // curl -sD - -o /dev/null -d 'grant_type=client_credentials&client_id=.....&client_secret=......' 'https://auth.goabout.com/token'
//
// // https://api.goabout.com/products?tl_latitude,tl_longitude,br_latitude,br_latitude,rentalbicycle}
//
// class GoAboutAPIClass {
//   constructor() {
//     if(getSettingsServerSide().goabout) {
//       this.enabled = getSettingsServerSide().goabout.enabled;
//     } else {
//       this.enabled = false;
//     }
//
//     this.lastCheck = 0;
// 	}
//
//   getBearerToken() {
//     try {
//       var settings = getSettingsServerSide().goabout;
//
//       response = HTTP.post(gGoAboutAuthURL,
//         { "params": {
//             "grant_type":"client_credentials",
//             "client_id":settings.clientid,
//             "client_secret":settings.clientsecret
//           }
//         }
//       );
//
//       // console.log('bearer token response:' + JSON.stringify(response));
//
//     } catch(ex) {
//         console.log('Goabout auth error: ' + ex);
//         return false;
//     }
//
//     if(response.statusCode==200) {
//       this.bearertoken = response.data.access_token;
//       var userbearertoken = getSettingsServerSide().goabout.userbearertoken;
//
//       console.log(`Goabout retrieved bearer tokens ${this.bearertoken} / ${userbearertoken}`);
//       return true;
//     } else {
//       console.log('Goabout unable to get bearer token. Status code ' + response.statusCode);
//       return false;
//     }
//   }
//
// 	// testWebservice() {
//   //   // curl -s -H 'Authorization: Bearer .....' 'https://api.goabout.com/'
//   //
//   //   try {
//   //     if(!this.enabled) {
//   //       console.log('goabout service is disabled');
//   //       return;
//   //     }
//   //
//   //     var url = gGoAboutAPIURL;
//   //     url = 'https://api.goabout.com/'
//   //     url = 'https://coconut.goabout.com/products/303/locations'
//   //     response = HTTP.get(url,
//   //       {
//   //         "headers": {
//   //                   "Authorization": "Bearer " + getSettingsServerSide().goabout.userbearertoken
//   //                 }
//   //       }
//   //     );
//   //
//   //     if(response.statusCode!=200) {
//   //       console.log('Goabout unable to get info. Status code ' + response.statusCode);
//   //       return false;
//   //     }
//   //
//   //     content = JSON.parse(response.content);
//   //     console.log('Goabout response:');
//   //     console.log(JSON.stringify(content,0,4));
//   //   } catch(ex) {
//   //       console.log('Goabout error:' + JSON.stringify(ex));
//   //       return false;
//   //   }
//   // }
//
//   getRandomDiscountCode() {
//     var codes = ["Hr2PDQz8","t5ruQNDU","f3MygK3V","tRLLrwhu","Hhy8zEcz",
//                  "DCUBTZnd","g26saPrM","xTWNFdsa","9Kn54xbC","d3qdTJRa"];
//
//     var code = codes[Math.floor(Math.random() * codes.length)];
//     return code.toString();
//   }
//
//   checkBikesForLocation(goaboutLocationItem, locationId, allExternalBikeIds) {
//     try {
//       if(!this.enabled) {
//         console.log('goabout service is disabled');
//         return;
//       }
//
//       url = `https://coconut.goabout.com/products/303/locations/${goaboutLocationItem.id}/bicycles`;
//       // console.log('call ' + url);
//       response = HTTP.get(url,
//         {
//           "headers": {
//                     "Authorization": "Bearer " + getSettingsServerSide().goabout.userbearertoken
//                   }
//         }
//       );
//
//       if(response.statusCode!=200) {
//         console.log('Goabout unable to get bike info. Status code ' + response.statusCode);
//         return false;
//       }
//
//       content = JSON.parse(response.content);
//       // console.log('Goabout bike response:');
//       // console.log(JSON.stringify(content,0,4));
//
//       _.each(content.items, (item)=>{
//         // goabout data:
//         // { id: 139,
//         //   label: 'SL!M Campusbike #139',
//         //   createdAt: '2017-06-08T14:00:21+00:00',
//         //   updatedAt: '2017-06-12T07:55:52+00:00',
//         //   inUse: false,
//         //   lock: { bluetoothId: 'AXA:BB99C815CD3A921D4AAE' } }
//         allExternalBikeIds.push(item.id.toString());
//         var current = Objects.findOne({$and: [{"lock.type": "goabout-v1"}, {"lock.settings.elockid": item.id.toString()}]});
//
//         var state = item.inUse ? "inuse": "available";
//         var code = this.getRandomDiscountCode()
//         var ts = new Date().valueOf();
//
//         var data = {
//             "locationId" : locationId,
//             "title" : item.label,
//             "description" : "",
//             "imageUrl" : "/files/ProviderLogos/go-about-logo.png",
//             "state" : {
//                 "state" : state,
//                 "userId" : null,
//                 "timestamp" : ts,
//                 "userDescription" : "",
//                 "rentalInfo" : {
//                   "pincode" : code
//                 }
//             },
//             "lock" : {
//                 "type" : "goabout-v1",
//                 "settings" : { elockid: item.id.toString(), code: item.lock.bluetoothId }
//             },
//             "price" : {
//                 "value" : "0",
//                 "currency" : "euro",
//                 "timeunit" : "day",
//                 "description" : "tijdelijk gratis"
//             }
//         }
//
//         var objectId;
//         if(!current) {
//           // console.log('add new object ' + data.title);
//           //console.log(JSON.stringify(data));
//
//           objectId = Objects.insert(data);
//         } else {
//           // console.log('update object ' + data.title);
//           //console.log(JSON.stringify(data));
//
//           objectId = current._id;
//           Objects.update(objectId, {$set: data});
//         }
//       }); // _.each
//     } catch(ex) {
//         console.log('Goabout checkBikesForLocation error:' + ex);
//         return false;
//     }
//   }
//
//   checkLocations() {
//     try {
//       if(!this.enabled) {
//         console.log('goabout service is disabled');
//         return;
//       }
//
//       var ts = new Date().valueOf();
//       if((ts - this.lastcheck) < 15000) {
//         // console.log('just checked. Please wait ' + (ts - this.lastcheck));
//         return true;
//       }
//       this.lastcheck = ts;
//
//       console.log('checking GoAbout status');
//
//       var url = 'https://coconut.goabout.com/products/303/locations'
//       response = HTTP.get(url,
//         {
//           "headers": {
//                     "Authorization": "Bearer " + getSettingsServerSide().goabout.userbearertoken
//                   }
//         }
//       );
//
//       if(response.statusCode!=200) {
//         console.log('Goabout unable to get location info. Status code ' + response.statusCode);
//         return false;
//       }
//
//       content = JSON.parse(response.content);
//       // console.log('Goabout location response:');
//       // console.log(JSON.stringify(content,0,4));
//
//       // check if the location still exists in the GoAbout config
//       var locations = Locations.find({locationType: "goabout"}).fetch();
//       _.each(locations, (location) => {
//         var found=false;
//         for(i=0;i<content.items.length;i++) {
//           // console.log(content.items[i].id.toString() + ' vs ' + location.externalId);
//           if(content.items[i].id.toString()==location.externalId) { found=true }
//         };
//         if(!found) {
//           // console.log('delete location ' + location._id);
//           Meteor.call('locations.remove', location._id);
//         }
//       });
//
//       var allBikeExternalIds = [];
//       _.each(content.items, (item)=>{
//         var current = Locations.findOne({$and: [{locationType: "goabout"}, {externalId: item.id.toString()}]});
//
//         var data = {
//           title: item.label,
//           lat_lng: item.coordinates.split(",").map(Number),
//           address: item.address,
//           description: item.instructions,
//           locationType: 'goabout',
//           externalId: item.id.toString(),
//           imageUrl : "/files/ProviderLogos/go-about-logo.png",
//         }
//
//         var locationId;
//         if(!current) {
//           // console.log('add new location');
//           // console.log(JSON.stringify(data));
//
//           locationId = Locations.insert(data);
//         } else {
//           // console.log('update location');
//           // console.log(JSON.stringify(data));
//
//           locationId = current._id;
//           Locations.update(locationId, {$set: data});
//         }
//
//         this.checkBikesForLocation(item, locationId, allBikeExternalIds);
//       }); // _.each
//
//       // remove non-existent bikes
//       var objects = Objects.find({$and: [{"state.state": "available"}, {"lock.type": 'goabout-v1'}]}).fetch();
//       // console.log("checking " + objects.length + " bikes vs " + allBikeExternalIds.length + " external ids");
//       _.each(objects, (object) => {
//         if(!allBikeExternalIds.includes(object.lock.settings.elockid.toString())) {
//           console.log('delete object ' + object._id + " vs " + object.lock.settings.elockid + '/' + allBikeExternalIds.includes(object.lock.settings.elockid.toString()));
//           Meteor.call('objects.remove', object._id);
//         }
//       });
//
//     } catch(ex) {
//         console.log('Goabout checkLocations error:' + ex);
//         return false;
//     }
//   }
//
//   // getAvailableProducts(s,w,n,e) {
//   //   // curl -s -H 'Authorization: Bearer .....' 'https://api.goabout.com/'
//   //
//   //   console.log(`rect n ${n} w ${w} s ${s} e ${e}`);
//   //
//   //   try {
//   //     var params = {
//   //       "tl_latitude":n,
//   //       "tl_longitude":w,
//   //       "br_latitude":s,
//   //       "br_longitude":e,
//   //       "category":"rentalbicycle"
//   //     }
//   //
//   //     response = HTTP.get('https://api.goabout.com/products', {
//   //       "headers": {
//   //                 "Authorization": "Bearer " + this.bearertoken
//   //               },
//   //       "params": params
//   //     });
//   //   } catch(ex) {
//   //     console.log('Goabout error:' + JSON.stringify(response,0,4));
//   //     return false;
//   //   }
//   //
//   //   if(response.statusCode==200) {
//   //     console.log(response);
//   //     content = JSON.parse(response.content);
//   //     if(content.itemHrefs&&content.itemHrefs.length>0) {
//   //       console.log('goAboutAPI content:');
//   //       console.log(content);
//   //     } else {
//   //       console.log('goAboutAPI: no content found!');
//   //     }
//   //
//   //     return true;
//   //   } else {
//   //     console.log('Goabout unable to call goabout api. Status code ' + response.statusCode);
//   //     return false;
//   //   }
//   // }
// }
//
// export const GoAboutAPI = new GoAboutAPIClass()
//
// Meteor.publish('goabout.objects_latlong', function goaboutPublication(s, w, n, e) {
//   console.log(`fetching goabout objects within [(${s}, ${w}), (${n}, ${e})]`);
//
//   // GoAboutAPI.getAvailableProducts(s,w,n,e);
//
//   this.ready();
//
//   return;
// });
//
// Meteor.methods( {
//   'goabout.checklocations'() {
//     return GoAboutAPI.checkLocations();
//   },
// });
