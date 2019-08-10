import { Objects } from '/imports/api/objects.js';
import { Locations } from '/imports/api/locations.js';
import { getUserDescription } from '/imports/api/users.js';
import { getSettingsServerSide } from '/imports/api/settings.js';

/* requires fix below in node_modules\soap\lib\client.js : 209+

for now, a cloned version of the node-soap repository is used to fix this

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

class SkopeiAPIClass {
  constructor() {
		this.promise = require("bluebird");

		var createClient = this.promise.promisify(require('soap').createClient);
		createClient(gSkopeiURL).then(Meteor.bindEnvironment(function(client)  {
      console.log('created soapclient')
        this.SoapClient = client;
      }.bind(this))
    ).catch(function(e) {
      console.log('unable to create soapclient')
      console.error(e.stack)
    })
	}

  addAuthentication(args) {
		var SHA256 = require("crypto-js/sha256");

    var skopeisettings = getSettingsServerSide().skopei;

		args.ID = skopeisettings.clientid;
		args.MessageID = Math.floor((Math.random() * 100000) + 1);

		var basestr = args.ID + skopeisettings.clientkey.toUpperCase() + args.MessageID;
		args.Hash = SHA256(basestr).toString().toUpperCase();
	}

	rentBike(objectId, locationId, durationHours = 4) {
    if(!getSettingsServerSide().skopei.enabled) {
      Meteor.call('log.write', `Skopei integration has been disabled`);
	  	return false;
    }

    var newState = 'inuse'
    var user = getUserDescription(Meteor.user());

    // Check if given Object exists on given Location
	  var object = Objects.findOne(objectId, {title:1, locationId:1});
	  if(!object||object.lock.type!='skopei-v1') {
	  	Meteor.call('log.write', `No object or unable to use skopei driver for non skopei object`);
	  	return false;
	  }

    // Check if Object has an e-lock
		ElockID = object.lock.settings.elockid;
		if(ElockID==0) {
	  	Meteor.call('log.write', `Skopei lock ID is not set for this object`);
	  	return false;
		}

		var dateStart = new Date();
		dateStart.setUTCHours(dateStart.getUTCHours());

		var dateEnd = new Date(dateStart);
		dateEnd.setUTCHours(dateStart.getUTCHours()+durationHours);

		var Code = Math.floor((Math.random() * 100000) + 1);

		// actual API call starts here
		var args = { Reservation: {
									ExternalID: '1',
									DateStart: dateStart.toISOString(),
									DateEnd: dateEnd.toISOString()},
		             	Reservationitems : {
		             		Vehicle: [
		             			{ ReservationItemData: {
		             					ElockID: ElockID,
		             					ExternalID: objectId,
		             					Code: Code}
		             			}
		             		]
		            }};
		this.addAuthentication(args);

		// context contains all info that is required for processing in the callback
		var context = {
			objectId: objectId,
      ElockID : ElockID
		}

    // Ask the API to do a reservation
    var addVehicleReservation = this.promise.promisify(this.SoapClient.addVehicleReservation, this);
    addVehicleReservation(args).then(Meteor.bindEnvironment(function(result) {
      if(result.addVehicleReservationResult.Result=="OK") {
        var vehicle=result.addVehicleReservationResult.Reservationitems.Vehicle;
        var reservation=result.addVehicleReservationResult.Reservation;
        rentalInfo = {
        	externalid: reservation.ExternalID,
					datestart: reservation.DateStart,
					dateend: reservation.DateEnd,
        	code: vehicle.ReservationItemData.Code,
        	id: vehicle.ReservationItemData.ID,	// returned by the API
					pincode: vehicle.ReservationItemData.Pincode // returned by the API
				};

				Meteor.call('objects.setState', this.objectId, Meteor.userId(), null, newState, user, rentalInfo);
				Meteor.call('log.write', 'addVehicleReservation: OK', result);
			} else {
				var description = "addVehicleReservation: NOT OK"
				Meteor.call('log.write', description, result);
			}
		}.bind(context))).catch(Meteor.bindEnvironment(function(err) {
			var description = "addVehicleReservation: SOAP ERROR"
			Meteor.call('log.write', description, err);
		  return false;
		}))

    // this.getLockInformation(ElockID, args.DateStart, args.DateEnd);

	  return true;
	}

	endRentBike(objectId, locationId) {
    if(!getSettingsServerSide().skopei.enabled) {
      Meteor.call('log.write', `Skopei integration has been disabled`);
	  	return false;
    }

	  var object = Objects.findOne(objectId, {title:1, locationId:1});
	  if(!object||object.lock.type!='skopei-v1') {
	  	Meteor.call('log.write', `No object or unable to use skopei driver for non skopei object`);
	  	return false;
	  }



		rentalInfo = object.state.rentalInfo;
    Meteor.call('log.write', 'endRentBike', rentalInfo);
		var args = { Reservation: {
										ExternalID: rentalInfo.externalid,
										DateStart: rentalInfo.datestart,
										DateEnd: rentalInfo.dateend,
										ID: rentalInfo.id

									},
		             	Reservationitems : {
		             		Vehicle: [
		             			{ ReservationItemData: {
		             					ElockID: object.lock.settings.elockid,
		             					ExternalID: objectId,
		             				}
		             			}
		             		]
		            }};
		this.addAuthentication(args);

		// context contains all info that is required for processing in the callback
		var context = {
			objectId: objectId
		}
		var endRentBike = this.promise.promisify(this.SoapClient.cancelVehicleReservation);
    endRentBike(args).then(Meteor.bindEnvironment(function(result) {
      if(result.cancelVehicleReservationResult.Result=="OK") {
	      Meteor.call('log.write', 'cancelVehicleReservation: OK', result);

		    var newState = 'available'
		    var user = getUserDescription(Meteor.user());

		    Meteor.call('objects.setState', context.objectId, null, locationId, newState, user);
		   } else  {
				var description = "cancelVehicleReservation: NOT OK"
				Meteor.call('log.write', description, result);
		   }
    }.bind(context))).catch(function(err) {
      Meteor.call('log.write', 'cancelVehicleReservation: SOAP error', err);
    })

    return true;
	}

  getLockInformation(ElockID,dateStartISO, dateEndISO) {
			// var args = { Reservation: {ExternalID: commonbikeReservationID, DateStart: dateStartISO, DateEnd: dateEndISO},
			//              Reservationitems : { 'Vehicle':[{ ReservationItemData: {ElockID: ElockID, ExternalID: commonbikeReservationID, Code: Code}}] }}; // { }
			var args = { Lock: {ElockID: ElockID, PeriodFrom: dateStartISO, PeriodTill: dateEndISO}}; // { }
			this.addAuthentication(args);
	    this.SoapClient.getLockInformation(args, Meteor.bindEnvironment(function(err, result) {
	    		if(err) {
            Meteor.call('log.write', 'getLockInformation: SOAP error', err);
	    		} else {
            Meteor.call('log.write', 'getLockInformation: ', JSON.stringify(result, null, 4));
	    		}
	    }.bind(this)));

      return 'OK'
  }

  getBikeStatus(objectId) {

    // unvalidated code

    if(!getSettingsServerSide().skopei.enabled) {
      Meteor.call('log.write', `Skopei integration has been disabled`);
	  	return false;
    }

    // Check if given Object exists on given Location
	  var object = Objects.findOne(objectId, {title:1, locationId:1});
	  if(!object||object.lock.type!='skopei-v1') {
	  	Meteor.call('log.write', `No object or unable to use skopei driver for non skopei object`);
	  	return false;
	  }

    // Check if Object has an e-lock
		ElockID = object.lock.settings.elockid;
		if(ElockID==0) {
	  	Meteor.call('log.write', `Skopei lock ID is not set for this object`);
	  	return false;
		}

		var dateStart = new Date();
		dateStart.setUTCHours(dateStart.getUTCHours());

		var dateEnd = new Date(dateStart);
		dateEnd.setUTCHours(dateStart.getUTCHours()+1);

    this.getLockInformation(ElockID, args.DateStart, args.DateEnd);

	  return true;
	}

	getReservationData(objectId) {
    if(!getSettingsServerSide().skopei.enabled) {
      Meteor.call('log.write', `Skopei integration has been disabled`);
	  	return false;
    }

    var object = Objects.findOne(objectId, {title:1, locationId:1});
    if(!object||object.lock.type!='skopei-v1') {
    	Meteor.call('log.write', `No object or unable to use skopei driver for non skopei object`);
    	return false;
    }

		var ElockID = object.lock.settings.elockid;
		if(ElockID==0) {
    	Meteor.call('log.write', `Skopei lock ID is not set for this object`);
    	return false;
		}

		var dateFromISO = "2017-05-01T00:00:00Z"; // startdt.toISOString()
		var dateToISO = "2017-05-02T00:00:00Z"; // enddt.toISOString()

		var args = { Reservation: {ExternalID: '1', DateStart: dateFromISO, DateEnd: dateToISO},
		             Reservationitems : { 'Vehicle':[{ ReservationItemData: {ElockID: ElockID}}] }}; // { }
		this.addAuthentication(args);

		var checkVehicleReservation = this.promise.promisify(this.SoapClient.checkVehicleReservation, this);
    checkVehicleReservation(args).then(Meteor.bindEnvironment(function(result) {
      Meteor.call('log.write', 'reservation info:' + JSON.stringify(result));
    })).catch(function(err) {
      Meteor.call('log.write', 'Unable to check vehicle reservation ' + JSON.stringify(err));
    })

    return true;
	}

	testWebservice(message) {
    console.log('test_service '+ message);

		var args = { text:  message};
		this.addAuthentication(args);

		console.log('+++++++++++++++++++++++++++++++++++++++');
		console.log(this.SoapClient);
		console.log('+++++++++++++++++++++++++++++++++++++++');

		var TestWebservice = this.promise.promisify(this.SoapClient.TestWebservice, this);

    TestWebservice(args).then(Meteor.bindEnvironment(function(result) {
    	console.log('Test Skopei webservice ' + JSON.stringify(result));
    }.bind(this))).catch(function(err) {
      Meteor.call('log.write', 'Unable to test Skopei webservice ' + JSON.stringify(err));
    })

    return true;
	}
}

function log_line(line, append=true, filename="./soaplog.txt") {
	// var fs = require('fs');
  console.log(line);
	// if(append) {
	// 	fs.appendFile(filename, line + "\n", function(err) {
	// 	    if(err) {
	// 	        return console.log(err);
	// 	    }
	// 	});
	// } else {
	// 	fs.writeFile(filename, line + "\n", function(err) {
	// 	    if(err) {
	// 	        return console.log(err);
	// 	    }
	// 	});
	// }
}

export const SkopeiAPI = new SkopeiAPIClass()

Meteor.methods( {
  'skopei.rentbike'(objectId, locationId) {
    return SkopeiAPI.rentBike(objectId, locationId)
  },
  'skopei.endrentbike'(objectId, locationId) {
    return SkopeiAPI.endRentBike(objectId, locationId);
  },
  'skopei.logrentalInfo'(objectId) {
    return SkopeiAPI.getReservationData(objectId);
  },
  'skopei.getBikeStatus'(objectId) {
    return SkopeiAPI.getBikeStatus(objectId);
  }
});
