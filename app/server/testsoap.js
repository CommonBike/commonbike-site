import { Meteor } from 'meteor/meteor'

import soap from 'soap'
// var soap = require('soap');
// var url = 'http://example.com/wsdl?wsdl';
// var args = {name: 'value'};
// soap.createClient(url, function(err, client) {
//     client.MyFunction(args, function(err, result) {
//         console.log(result);
//     });
// });

Meteor.methods({
  testsoap() {
    console.log(soap)
    return 'OK'
  },
})
