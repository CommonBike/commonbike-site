// import soap from 'soap'
// var soap = require('soap');
// var url = 'http://example.com/wsdl?wsdl';
// var args = {name: 'value'};
// soap.createClient(url, function(err, client) {
//     client.MyFunction(args, function(err, result) {
//         log_line(result);
//     });
// });

/* 
requires fix below in node_modules\soap\lib\client.js : 209+

Client.prototype._setSequenceArgs = function(argsScheme, args) {
  var result = {};

  // console.log('==================================================');
  // console.log('argsScheme:');
  // console.log(argsScheme);
  // console.log('args:');
  // console.log(args);

  if(typeof argsScheme !== 'object') {
    return args;
  }

  for (var partIndex in argsScheme) {
    var tmpPartIndex = partIndex.replace('[]', '');
//    console.log('tmpPartIndex: ' + tmpPartIndex + '/' + partIndex);
    if(typeof args[tmpPartIndex] === 'undefined') {
  //    console.log('case undefined ');
      continue;
    }
    if(typeof argsScheme[tmpPartIndex] !== 'object') {
//      console.log('not object ' + args[tmpPartIndex]);
      result[tmpPartIndex] = args[tmpPartIndex];
    } else {
//      console.log('object - recurse into ');
      result[tmpPartIndex] = this._setSequenceArgs(argsScheme[tmpPartIndex], args[tmpPartIndex]);
    }
  }
//  console.log('result:')
//  console.log(result);
//  console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
  return result;
};
*/

gSkopeiURL = 'https://backend-tst.skopei.com/webservice/ReservationV1.svc?wsdl';
gClientId = 'COMMONBIKE';
gClientKey = 'b453d2b0-9da1-4c5b-ab3c-6b6b5d7b7dbc';   

function log_line(line, append=true, filename="./soaplog.txt") {
	var fs = require('fs');
  console.log(line);
	if(append) {
		fs.appendFile(filename, line + "\n", function(err) {
		    if(err) {
		        return console.log(err);
		    }
		}); 	
	} else {
		fs.writeFile(filename, line + "\n", function(err) {
		    if(err) {
		        return console.log(err);
		    }
		}); 	
	}
}

function add_authentication(args) {
	var SHA256 = require("crypto-js/sha256");

	args.ID = gClientId;
	args.MessageID = Math.floor((Math.random() * 100000) + 1);

	var basestr = args.ID + gClientKey.toUpperCase() + args.MessageID;
	args.Hash = SHA256(basestr).toString().toUpperCase();
}

function rent_bike(ElockID, durationHours = 24) {
		var soap = require('soap');

		soap.createClient(gSkopeiURL,function(err, client) {
				var dateStart = new Date();
				var dateEnd = new Date(dateStart);
				console.log(durationHours);
				dateEnd.setUTCHours(dateStart.getUTCHours()+durationHours);

		    log_line('**** RENT BICYCLE ************************');
		    log_line('from: ',dateStart.toISOString());
		    log_line('to: ',dateEnd.toISOString());

				var reservationID = Math.floor((Math.random() * 1000000) + 1);
				var reservationCode = Math.floor((Math.random() * 100000) + 1);
		
				var args = { Reservation: {ExternalID: reservationID, DateStart: dateStart.toISOString(), DateEnd: dateEnd.toISOString()},
				             Reservationitems : { 'Vehicle':[{ ReservationItemData: {ElockID: ElockID, ExternalID: reservationID, Code: reservationCode}}] }}; // { }
				add_authentication(args);

				console.log(JSON.stringify(args, null, 2));

		    client.addVehicleReservation(args, function(err, result) {
		    		if(err) {
			        log_line('Skopei reservation - error');
			        log_line(JSON.stringify(err, null,4));
		    		} else {
			        if(result.addVehicleReservationResult.Result=="OK") {
			    			log_line('AddVehicleReservation - Reservation OK')
			    			log_line(result);
				        log_line(JSON.stringify(result, null, 4), true, './skopei_results.txt');
				        
				        var vehicle=result.addVehicleReservationResult.Reservationitems.Vehicle;
				        var reservation=result.addVehicleReservationResult.Reservation;
				        reservationInfo = { 
				        	ElockID: vehicle.ReservationItemData.ElockID,
				        	commonbikeID: vehicle.ReservationItemData.ExternalID,
									dateStart: reservation.DateStart,
									dateEnd: reservation.DateEnd,
				        	skopeiID: vehicle.ReservationItemData.ID,
				        	skopeiCode: vehicle.ReservationItemData.Code,
									pincode: vehicle.ReservationItemData.Pincode};

								log_line(JSON.stringify(reservationInfo, null, 4));

								var fromdtISO = "2017-01-01T00:00:00Z"; // startdt.toISOString()
								var todtISO = "2017-05-01T00:00:00Z"; // enddt.toISOString()

								getReservationData(fromdtISO, todtISO, reservationInfo.ElockID);

								var dummydate = new Date().toISOString();
								cancel_reservation(reservationInfo)
							} else {
								log_line("unable to add vehicle reservation ");
								log_line(JSON.stringify(result, null, 4));

						    // log_line(client.lastMessage);
							}
		    		} 
		    });

		    return true;
		});

    return true;
};

// cancel/end current reservation
function cancel_reservation(reservationInfo) {
		var soap = require('soap');
		soap.createClient(gSkopeiURL,function(err, client) {
        log_line('cancelVehicleReservation');
        log_line(reservationInfo);
				var args = { Reservation: {ExternalID: reservationInfo.commonbikeID, DateStart: reservationInfo.dateStart, DateEnd: reservationInfo.dateEnd, ID: reservationInfo.skopeiID},
				             Reservationitems : { 'Vehicle':[{ ReservationItemData: {ElockID: reservationInfo.ElockID, ExternalID: reservationInfo.commonbikeID, Code: reservationInfo.skopeiCode}}] }}; // { }
				add_authentication(args);

		    client.cancelVehicleReservation(args, function(err, result) {
		    		if(err) {
							log_line('********************************************************************************\n');
			        log_line('cancelVehicleReservation - error ');
			        // log_line(err);
		    		} else {
							log_line('********************************************************************************\n');
			        log_line(result);
			        log_line(JSON.stringify(result, null, 4), true, './skopei_results.txt');
		    		}
		    });

		    // log_line(client.lastMessage);
		});

    return 'OK'
};

// extend current reservation with X hours

function getReservationData(dateFromISO, dateToISO, ElockID) {
		var soap = require('soap');
		soap.createClient(gSkopeiURL, function(err, client) {
				var args = { Reservation: {DateStart: dateFromISO, DateEnd: dateToISO},
				             Reservationitems : { 'Vehicle':[{ ReservationItemData: {ElockID: ElockID}}] }}; // { }
				add_authentication(args);

				// log_line(args);

		    client.checkVehicleReservation(args, function(err, result) {
		    		if(err) {
			        log_line('checkVehicleReservation - error ');
			        // log_line(err);
		    		} else {
			        log_line('=== RESERVATION INFO ==========================');
			        log_line(result);
			        log_line(JSON.stringify(result, null, 4), true, './skopei_results.txt');
			        log_line('=== RESERVATION INFO ENDS =====================');

			        // info = { skopeiID: result.Reservationitems.Vehicle.ReservationItemData.ID,
											//  commonbikeID: result.Reservationitems.Vehicle.ReservationItemData.ExternalID,
											//  pincode: result.Reservationitems.Vehicle.ReservationItemData.Pincode,
											//  dateStart: result.Reservation.DateStart,
											//  dateEnd: result.Reservation.DateEnd};

		    		}
		    });
		});

    return 'OK'
}

function getLockInformation(ElockID,dateStartISO, dateEndISO) {
		var soap = require('soap');
		soap.createClient(gSkopeiURL, function(err, client) {
				// var args = { Reservation: {ExternalID: commonbikeReservationID, DateStart: dateStartISO, DateEnd: dateEndISO},
				//              Reservationitems : { 'Vehicle':[{ ReservationItemData: {ElockID: ElockID, ExternalID: commonbikeReservationID, Code: Code}}] }}; // { }
				var args = { Lock: {ElockID: ElockID, PeriodFrom: dateStartISO, PeriodTill: dateEndISO}}; // { }
				add_authentication(args);
		    client.getLockInformation(args, function(err, result) {
		    		if(err) {
			        log_line('checkVehicleReservation - error ');
			        // log_line(err);
		    		} else {
			        log_line(result);
			        log_line(JSON.stringify(result, null, 4), true, './skopei_results.txt');
		    		}
		    });
		});

    return 'OK'
}

 function testsoap() {
		var soap = require('soap');
		soap.createClient(gSkopeiURL, function(err, client) {
				// var info = client.describe();

				// var args = {Text: 'hahahoho'};
				// add_authentication(args);

		  //   client.TestWebservice(args, function(err, result) {
		  //   		if(err) {
			 //        log_line('TestWebservice - error ' + err);
		  //   		} else {
			 //        log_line(result);
		  //   		}
		  //   });

				var args = { ElockID: "170178"}; // , PeriodTill: '2017-04-30T23:59:59Z'}
				add_authentication(args);

				log_line(args);

		    client.getLockInformation(args, function(err, result) {
		    		if(err) {
			        log_line('getLockInformation - error ');
			        log_line(err);
		    		} else {
			        log_line(result);
			        log_line(JSON.stringify(result, null, 4), true, './skopei_results.txt');
		    		}
		    });
		});

    return 'OK'
};

log_line('-- test Skopei API ---------', false);


var duration_hours = 8


// var startdtISO = startdt.toISO();
// var endDTISO = enddt.toISO();

// for get lock info display
var fromdtISO = "2017-01-01T00:00:00Z"; // startdt.toISOString()
var todtISO = "2017-05-01T00:00:00Z"; // enddt.toISOString()

var startdtISO = "2017-04-21T12:00:00Z"; // startdt.toISOString()
var enddtISO = "2017-04-21T20:00:00Z"; // enddt.toISOString()
var ElockID1 = '170178';

rent_bike(ElockID1);
