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

gClientId = 'COMMONBIKE';
gClientKey = 'b453d2b0-9da1-4c5b-ab3c-6b6b5d7b7dbc';   

function add_authentication(args) {
	args.ID = gClientId;
	args.MessageID = Math.floor((Math.random() * 100000) + 1);

	var basestr = args.ID + gClientKey.toUpperCase() + args.MessageID;
	args.hash = CryptoJS.SHA256(basestr).toString();
}

Meteor.methods({
  testsoap() {

		var soap = require('soap');
		var url = 'https://backend-tst.skopei.com/webservice/ReservationV1.svc?wsdl';

		soap.createClient(url, function(err, client) {
		    console.log(client.describe());
		    console.log(client.getLockInformation);

				// var args = {testvalue: 'hahahoho'};
				// add_authentication(args);

		  //   client.TestWebservice(args, function(err, result) {
		  //   		if(err) {
			 //        console.log('TestWebservice - error ' + err);
		  //   		} else {
			 //        console.log(result);
		  //   		}
		  //   });

				// var args = {};
				// add_authentication(args);

		  //   client.getLockInformation(args, function(err, result) {
		  //   		if(err) {
			 //        console.log('getLockInformation - error ');
			 //        // console.log(err);
		  //   		} else {
			 //        console.log(result);
		  //   		}
		  //   });




		});

    return 'OK'
  },
})
