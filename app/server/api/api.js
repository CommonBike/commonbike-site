import { ApiKeys } from '/imports/api/api-keys.js'
import { Objects, getStateChangeNeatDescription } from '/imports/api/objects.js'

lockerAPI = {
  authentication: function( apiKey ) {
    var getObject = ApiKeys.findOne( { "key": apiKey, "type": "object" }, { fields: { "ownerid": 1 } } );
    console.log('validation', apiKey);
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
        lockerAPI.utility.response( response, 404, { error: 404, message: "Unknown locker" } );
        return;
      }
      
      var hasData   = lockerAPI.utility.hasData( connection.data );
      if(!hasData) {
        // send status
        objectinfo = {
          title: object.title,
          state: object.state.state
        }

        lockerAPI.utility.response( response, 200, objectinfo );
        return;
      }

      var validData = lockerAPI.utility.validate( connection.data, { "action": String });
      if (validData) {
        var action = connection.data.action;
        switch(object.state.state) {
          case 'available':
            if(action=='rent_start'||action=='rent_toggle') {
              var newState = 'inuse'
              var timestamp = new Date().valueOf();
              Objects.update({_id: object._id}, { $set: {
                  'state.userId': null,
                  'state.state': newState,
                  'state.timestamp': timestamp,
                  'state.userDescription': 'via kluisbediening',
                  'state.rentalInfo': {} }
              });

              var object = Objects.findOne(connection.owner, {title:1, 'state.state':1 });
              var description = getStateChangeNeatDescription(object.title, newState);
              Meteor.call('transactions.changeStateForObject', newState, description, object._id, null);    

              objectinfo = {
                title: object.title,
                state: object.state.state
              }

              lockerAPI.utility.response( response, 200, objectinfo );
            } else {
              lockerAPI.utility.response( response, 403, { error: 403, message: "Unable to execute " + action + ". locker is " + object.state.state } );
            }
            break;
          case 'reserved':
          case 'inuse':
            if(action=='rent_end'||action=='rent_toggle') {
              var newState = 'available'
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

              objectinfo = {
                title: object.title,
                state: object.state.state
              }

              lockerAPI.utility.response( response, 200, objectinfo );
            } else {
              lockerAPI.utility.response( response, 403, { error: 403, message: "Unable to execute " + action + ". locker is " + object.state.state} );
            }
            break;
          case 'outoforder':
          default:
            lockerAPI.utility.response( response, 403, { error: 403, message: "Unable to execute " + action + ". locker is " + object.state.state } );
            break;
        }
      } else {
        lockerAPI.utility.response( response, 403, { error: 403, message: "POST calls must have an action (rent_start or rent_end) passed in the request body in the correct format." } );
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

var bodyParser = require("body-parser");
//    .use(bodyParser.json())

WebApp.connectHandlers
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())    
    .use('/api/locker/v1', function (req, res) {
  console.log('Doing stuff with lockers!!!!')
  console.log(getStateChangeNeatDescription);

  this.data = '';

  res.setHeader( 'Access-Control-Allow-Origin', '*' );

  if ( req.method === "OPTIONS" ) {
    res.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
    res.setHeader( 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS' ); // PUT, DELETE -> not used / accepted
    res.end( 'Set OPTIONS.' );
  } else {
    lockerAPI.handleRequest( req, res, 'object' );
  }  
});
