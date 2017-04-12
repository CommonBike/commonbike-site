// import soap from 'soap'
// var soap = require('soap');
// var url = 'http://example.com/wsdl?wsdl';
// var args = {name: 'value'};
// soap.createClient(url, function(err, client) {
//     client.MyFunction(args, function(err, result) {
//         console.log(result);
//     });
// });

gSkopeiURL = 'https://backend-tst.skopei.com/webservice/ReservationV1.svc?wsdl';
gClientId = 'COMMONBIKE';
gClientKey = 'b453d2b0-9da1-4c5b-ab3c-6b6b5d7b7dbc';   

gTempExternalID = '5437710000'

gElockID1 = '160020';

function add_authentication(args) {
	var SHA256 = require("crypto-js/sha256");

	args.ID = gClientId;
	args.MessageID = Math.floor((Math.random() * 100000) + 1);

	var basestr = args.ID + gClientKey.toUpperCase() + args.MessageID;
	args.Hash = SHA256(basestr).toString().toUpperCase();
}

// the following actions must be implemented

// make X hour reservation that starts immediately
function rent_bike(ELockID, duration_hours = 24) {
		var soap = require('soap');
		soap.createClient(gSkopeiURL,function(err, client) {
				// var info = client.describe();
		  //   console.log(info.Webservice_ReservationV1.BasicHttpsBinding_Interface_ReservationV1.addVehicleReservation.input);
				// console.log(info);

				var startdt = new Date();
				var enddt = new Date(startdt);
				enddt.setUTCHours(enddt.getUTCHours()+duration_hours);

				var args = { Reservation: {ExternalID: gTempExternalID, DateStart: startdt.toISOString(), DateEnd: enddt.toISOString()},
				             'Reservationitems': {'Vehicle[]': { ReservationItemData: {ElockID: gElockID1, ExternalID: gTempExternalID, Code: '9999'}}}}; // { }
				add_authentication(args);

				// console.log(args);
				console.log('********************************************************************************\n');

		    client.addVehicleReservation(args, function(err, result) {
		    		if(err) {
							console.log('********************************************************************************\n');
			        console.log('addVehicleReservation - error ');
			        // console.log(err);
		    		} else {
							console.log('********************************************************************************\n');
			        console.log(result);
		    		}
		    });

				// console.log(client);
		    console.log(client.lastRequest);
		});

    return 'OK'
};

// cancel/end current reservation
function cancel_reservation(ELockID, duration_hours = 24) {
		var soap = require('soap');
		soap.createClient(gSkopeiURL,function(err, client) {
				var startdt = new Date();
				var enddt = new Date(startdt);
				enddt.setUTCHours(enddt.getUTCHours()+duration_hours);

				var args = { Reservation: {ExternalID: gTempExternalID, DateStart: startdt.toISOString(), DateEnd: enddt.toISOString()},
				             Reservationitems: {'Vehicle[]': { ReservationItemData: {ElockID: gElockID1, ExternalID: gTempExternalID, Code: '9999'}}}}; // { }
				add_authentication(args);

		    client.cancelVehicleReservation(args, function(err, result) {
		    		if(err) {
							console.log('********************************************************************************\n');
			        console.log('cancelVehicleReservation - error ');
			        console.log(err);
		    		} else {
							console.log('********************************************************************************\n');
			        console.log(result);
		    		}
		    });

		    console.log(client.lastRequest);
		});

    return 'OK'
};

// extend current reservation with X hours

// haal lijst met huidige reserveringen
function getReservationData(duration_hours=4) {
		var soap = require('soap');
		soap.createClient(gSkopeiURL, function(err, client) {
				var startdt = new Date();
				var enddt = new Date(startdt);
				enddt.setUTCHours(enddt.getUTCHours()+duration_hours);

				var args = { Reservation: {ExternalID: gTempExternalID, DateStart: startdt.toISOString(), DateEnd: enddt.toISOString()}}; // { Code: '9999', ElockID: '160020', ExternalID: gTempExternalID}
				add_authentication(args);

				console.log(args);

		    client.checkVehicleReservation(args, function(err, result) {
		    		if(err) {
			        console.log('checkVehicleReservation - error ');
			        // console.log(err);
		    		} else {
			        console.log(result);
		    		}
		    });
		});

    return 'OK'
}


 function testsoap() {

		var soap = require('soap');

		soap.createClient(gSkopeiURL, function(err, client) {
				var info = client.describe();

				// var args = {testvalue: 'hahahoho'};
				// add_authentication(args);

		  //   client.TestWebservice(args, function(err, result) {
		  //   		if(err) {
			 //        console.log('TestWebservice - error ' + err);
		  //   		} else {
			 //        console.log(result);
		  //   		}
		  //   });

				var args = { Lock: {ElockID: gElockID1}}; // , PeriodTill: '2017-04-30T23:59:59Z'}
				add_authentication(args);

				console.log(args);

		    client.getLockInformation(args, function(err, result) {
		    		if(err) {
			        console.log('getLockInformation - error ');
			        console.log(err);
		    		} else {
			        console.log(result);
		    		}
		    });




		});

    return 'OK'
};

//testsoap();
rent_bike(1,24);
// getReservationData();
