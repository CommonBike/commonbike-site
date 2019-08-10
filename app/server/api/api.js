import { ApiKeys } from '/imports/api/api-keys.js'
import { Objects, getStateChangeNeatDescription } from '/imports/api/objects.js'
import { UpdatePaymentOrder, UpdateAllPaymentOrders } from '/server/api/paymentservices/mollie.js'
import { Settings } from '/imports/api/settings.js';

// demo of open-bikelocker / keylocker API usage (localhost)
//
// 1. Create a new bike with name "API Demo bike"
// 2. Go to bike settings (click info from my locations -> location -> API Demo Bike)
// 3. Set lock type to "open-bikelocker" (Instellingen -> Slot section -> open bikelocker -> save settings)
// 4. Create an API key for the lock (API keys -> set beschrijving to "api demo" -> click "+")
// 5. Copy API key to a text document (click on clipboard icon)
//
// now test the API:
//
// using a webbrowser:
//
// set in use:
//   http://localhost:3000/api/locker/v1?api_key=<your key here>&cardhash=00000000&pincode=12345&timestamp=1&action=inuse
//
// set available:
//   http://localhost:3000/api/locker/v1?api_key=<your key here>&cardhash=00000000&pincode=12345&timestamp=1&action=available
//
// using curl:
//
// set in use:
// curl -X POST \
//   http://localhost:3000/api/locker/v1/ \
//   -H 'cache-control: no-cache' \
//   -H 'content-type: application/x-www-form-urlencoded' \
//   -d 'api_key=<your key here>&cardhash=00000000&pincode=12345&timestamp=1&action=inuse'
//
// set available:
// curl -X POST \
//   http://localhost:3000/api/locker/v1/ \
//   -H 'cache-control: no-cache' \
//   -H 'content-type: application/x-www-form-urlencoded' \
//   -d 'api_key=<your key here>&cardhash=00000000&pincode=12345&timestamp=1&action=available'

lockerAPI = {
  authentication: function( apiKey ) {
    var getObject = ApiKeys.findOne( { "key": apiKey, "type": "object" }, { fields: { "ownerid": 1 } } );
    if ( getObject ) {
      return getObject.ownerid;
    } else {
      return false;
    }
  },
  connection: function( request ) {
    var getRequestContents = lockerAPI.utility.getRequestContents( request ),
        apiKey             = getRequestContents.api_key,
        validObject        = lockerAPI.authentication( apiKey );

    if ( validObject ) {
      delete getRequestContents.api_key;
      return { owner: validObject, data: getRequestContents };
    } else {
      return { error: 401, message: "Invalid API key." };
    }
  },
  handleRequest: function( request, response, resource, method ) {
    var connection = lockerAPI.connection( request );
    if ( !connection.error ) {
      lockerAPI.methods[ resource ]( response, connection );
    } else {
      lockerAPI.utility.response( response, 401, connection );
    }
  },
  methods: {
    object: function( response, connection ) {
      var object = Objects.findOne({_id: connection.owner});
      if(!object) {
        Meteor.call('log.write', "request for unknown locker", connection.owner)
        lockerAPI.utility.response( response, 404, { error: 404, message: "Unknown locker" } );
        return;
      }

      objectinfo = {
        state: object.state.state,
        timestamp: object.state.timestamp,
        username: '',
      }

      if(object.state.rentalInfo&&object.state.rentalInfo.cardhash) {
        objectinfo.cardhash = object.state.rentalInfo.cardhash;
      } else {
        objectinfo.cardhash = '';
      }

      var hasData   = lockerAPI.utility.hasData( connection.data );
      if(!hasData) {
        // send status
        lockerAPI.utility.response( response, 200, objectinfo );
        return;
      }

      var validData = lockerAPI.utility.validate( connection.data, { "action": String, "cardhash": String, "pincode": String, "timestamp": String });
      if (!validData) {
          Meteor.call('log.write', "invalid action request from locker ", connection.data)
          lockerAPI.utility.response( response, 403, { error: 403, message: "POST calls must have an action, cardhash and pincode passed in the request body in the correct format." } );
      } else {
        Meteor.call('log.write', "action request from locker ", connection.data)

        var action = connection.data.action;
        var cardhash = connection.data.cardhash;
        var pincode = connection.data.pincode;
        // var timestamp = connection.data.timestamp; -> Later convert from locker date/time
        var timestamp =  new Date().valueOf();

        var userId = object.state.userId;
        var description = object.state.userDescription;
        if(cardhash=="00000000") {
          // keep existing userid / description
        } else {
          // card used to rent the locker: find if a user exists with the given cardhash as a card
          if(false) {
            // statedata.state.userId = -> id van gevonden gebruiker
            userId="";
            description="Lokaal gehuurd"
          } else {
            userId="";
            description="Lokaal gehuurd"
          }
        }

        var statedata = {
            'state.state': action,
            'state.userId': userId,
            'state.userDescription': description,
            'state.timestamp': timestamp,
            'state.rentalInfo.cardhash': cardhash,
            'state.rentalInfo.pincode': pincode
        }

        switch(action) {
          case 'inuse':
            Meteor.call('log.write', "API: locker " + connection.owner + " state set to inuse")
            var newState = action;
            var timestamp = new Date().valueOf();
            Objects.update({_id: object._id}, { $set: statedata });

            var object = Objects.findOne(connection.owner, {title:1, 'state.state':1 });
            var description = getStateChangeNeatDescription(object.title, newState);
            Meteor.call('transactions.changeStateForObject', newState, description, object._id, null);

            objectinfo.state = object.state.state;
            objectinfo.timestamp = object.state.timestamp;
            objectinfo.username = '';
            objectinfo.cardhash = object.state.rentalInfo.cardhash;

            lockerAPI.utility.response( response, 200, objectinfo );

            break;
          case 'outoforder':
          case 'available':
            Meteor.call('log.write', "API: locker " + connection.owner + " state set to " + action);
            var newState = action;
            var timestamp = new Date().valueOf();
            Objects.update({_id: object._id}, { $set: {
                'state.userId': null,
                'state.state': newState,
                'state.timestamp': timestamp,
                'state.userDescription': '',
                'state.rentalInfo': {} }
            });

            var object = Objects.findOne(connection.owner, {title:1, 'state.state':1 });
            var description = getStateChangeNeatDescription(object.title, newState);
            Meteor.call('transactions.changeStateForObject', newState, description, object._id, null);

            objectinfo.state = object.state.state;
            objectinfo.timestamp = object.state.timestamp;
            objectinfo.username = '';
            objectinfo.cardhash = '';

            lockerAPI.utility.response( response, 200, objectinfo );
            break;
          default:
            Meteor.call('log.write', "API: locker " + connection.owner + " unable to execute " + action);
            lockerAPI.utility.response( response, 403, { error: 403, message: "Unable to execute " + action + ". locker is " + object.state.state } );
            break;
        }
      }
    }
  },
  resources: {},
  utility: {
    getRequestContents: function( request ) {
      switch( request.method ) {
        case "GET":
          return request.query;
        case "POST":
        case "PUT":
        // case "DELETE":
          return request.body;
        }
    },
    hasData: function( data ) {
      return Object.keys( data ).length > 0 ? true : false;
    },
    response: function( response, statusCode, data ) {
      response.setHeader( 'Content-Type', 'application/json' );
      response.statusCode = statusCode;
      var json_data = JSON.stringify(data);
      response.end(json_data);
      // response.end( '{title:\'marc\'}' ); // , state: \'available\'
    },
    validate: function( data, pattern ) {
      return Match.test( data, pattern );
    }
  }
};

//
const paymentAPI = {
  handleRequest: function(req, res) {
    res.statusCode = 200 // res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end()

    const externalPaymentId = req.body.id
    check(externalPaymentId, String)
    let paymentOrder = Payments.findOne({externalPaymentId: externalPaymentId})
    if (!paymentOrder) {
      console.error('Unknown externalPaymentId', externalPaymentId)
      return
    }

    // console.log('FOUND PAYMENTORDER', paymentOrder)
    // console.log('visited payment webhook: UpdatePaymentOrder', externalPaymentId)
    UpdatePaymentOrder(paymentOrder)
  }
}

//
var bodyParser = require("body-parser");
//    .use(bodyParser.json())

WebApp.connectHandlers
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use('/api/locker/v1', function (req, res) {
      res.setHeader( 'Access-Control-Allow-Origin', '*' );

      if ( req.method === "OPTIONS" ) {
        res.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
        res.setHeader( 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS' ); // PUT, DELETE -> not used / accepted
        res.end( 'Set OPTIONS.' );
      } else {
        lockerAPI.handleRequest( req, res, 'object' );
      }
    })
    .use('/api/payment/webhook/mollie/v1', function (req, res) {
      paymentAPI.handleRequest(req, res)
    })
