import { Meteor } from 'meteor/meteor';
import { Locations } from '/imports/api/locations.js'; 
import { Objects } from '/imports/api/objects.js'; 

const {testdata = {}} = Meteor.settings.private

const log = (msg) => {
  if (testdata.log) {
    console.log(msg)
  }
}

var testUsers = [
    {name:"admin",email:"admin@commonbike.com",
     password:"common!!", roles:['admin']},
    {name:"user1",email:"user1@commonbike.com",
     password:"common!!", roles:[]},
    {name:"User2",email:"user2@commonbike.com",
     password:"common!!", roles:[]},
    {name:"provider @ J156A",email:"j156a@commonbike.com",
     password:"common!!",roles:[]},
    {name:"provider @ s2m",email:"s2m@commonbike.com",
     password:"common!!",roles:[]},
    {name:"provider @ Zeist",email:"zeist@commonbike.com",
     password:"common!!",roles:[]},
  ];

var testLocations = [
  {title:"J156A",
   address: "Jutfaseweg 156A, Utrecht, Netherlands",
   imageUrl:'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bike-256.png',
   providers:["j156a@commonbike.com", "user1@commonbike.com"],
   bikeimage: '/files/Block/bike.png',
   bikes: [ { title: 'Batavus 1 (AXA)', description: 'Fietsnr. 1122 (AXA lock)', state: 'available', locktype: 'axa-elock'}, 
            { title: 'Batavus 2 (KeyLocker)', description: 'Fietsnr. 1134 (keylocker)', state: 'available', locktype: 'open-keylocker'}, 
            { title: 'Batavus 3', description: 'Fietsnr. 1145', state: 'available'},
            { title: 'Batavus 4', description: 'Fietsnr. 1166', state: 'outoforder'} ]
  },
  {title:"S2M",
   description: "The heart and mind",
   address:"Moreelsepark 65, Utrecht, Netherlands",
   imageUrl:'https://cdn1.iconfinder.com/data/icons/UrbanStories-png-Artdesigner-lv/256/Bicycle_by_Artdesigner.lv.png',
   providers:["s2m@commonbike.com", "user2@commonbike.com"],
   bikeimage: '/files/Block/bike.png',
   bikes: [ { title: 'Giant 1', description: 'Damesfiets 33879', state: 'available'}, 
            { title: 'Giant 2', description: 'Damesfiets 33277 (met kinderzit)', state: 'available'}, 
            { title: 'Giant 3', description: 'Herenfiets 31119', state: 'available'},
            { title: 'Bakfiets', description: 'Bakfiets', state: 'available'} ]
  },
  {title:"Lockers Zeist",
   address:"Zeist, Netherlands",
   imageUrl:'/files/Testdata/lockers.png',
   providers:["zeist@commonbike.com", "user1@commonbike.com"],
   bikeimage: '/files/Testdata/locker.png',
   bikes: [ { title: 'Bikelocker A', description: 'Linkerkluis', state: 'available', locktype: 'open-bikelocker'}, 
            { title: 'Bikelocker B', description: '1e kluis van links', state: 'available', locktype: 'open-bikelocker'}, 
            { title: 'Bikelocker C', description: '2e kluis van links', state: 'available', locktype: 'open-bikelocker'},
            { title: 'Bikelocker D', description: '3e kluis van links', state: 'available', locktype: 'open-bikelocker'},
            { title: 'Bikelocker E', description: '3e kluis van rechts', state: 'outoforder', locktype: 'open-bikelocker'}, 
            { title: 'Bikelocker F', description: '2e kluis van rechts', state: 'outoforder', locktype: 'open-bikelocker'}, 
            { title: 'Bikelocker G', description: '1e kluis van rechts', state: 'outoforder', locktype: 'open-bikelocker'},
            { title: 'Bikelocker H', description: 'rechterkluis', state: 'available', locktype: 'open-bikelocker'} ]
  },
  {title:"Zonder provider",
   imageUrl:'/files/Testdata/lockers.png',
   providers:[],
   bikeimage: '/files/Testdata/locker.png',
   bikes: [ { title: 'Fiets 1', description: 'Blauwe fiets', state: 'available'}, 
            { title: 'Fiets 2', description: 'Witte fiets', state: 'available'}, 
            { title: 'Fiets 3', description: 'Rode fiets', state: 'available'} ]
  }
];

var cleanupTestdata = function() {
  _.each(testUsers, function (userData) {
    var hithere=Accounts.findUserByEmail(userData.email);
    if(hithere) {
      var id = hithere._id;

      _.each(userData.roles, function (role) {
          if (Roles.userIsInRole(id, [role])) {
              Roles.removeUsersFromRoles(id, [role]);
            }
        });

      Meteor.users.remove({_id: id});
    } 
  });

  _.each(testLocations, function (locationData) {
    var hereitis=Locations.findOne({title: locationData.title});
    if(hereitis) {
        var id = hereitis._id;

        // remove all objects for this location
        var myObjects = Objects.find({locationId: id}).fetch();
        _.each(myObjects, function (objectData) {
           console.log('remove object' + objectData._id);
           Objects.remove({_id: objectData._id});
        });

        Locations.remove({_id: id});

    }
  });
}

var checkTestUsers = function() {
    log('checking default users');

    _.each(testUsers, function (userData) {
      var id;
      
      var hithere=Accounts.findUserByEmail(userData.email);
      if(hithere) {
      id = hithere._id;
    } else {
      id = Accounts.createUser({
        email: userData.email,
        password: userData.password,
        profile: { name: userData.name }
      });

      // email verification
      Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true}});
      log('added test user ' + userData.name);
    }

    _.each(userData.roles, function (role) {
        if (!Roles.userIsInRole(id, [role])) {
          log('adding user ' + userData.name + ' to role ' + role);
          Roles.addUsersToRoles(id, [role]);
        }
      });
    });    
}

const Address2LatLng = (address) => {
  if (!address) {
    return ''
  }

  const url = 'http://maps.google.com/maps/api/geocode/json?address=' + encodeURI(address)
  const response = HTTP.get(url)
  const obj = JSON.parse(response.content)
  const location = obj.results[0].geometry.location
  return [location.lat, location.lng]
}

// supported locktypes 
// 'plainkey' - ask for key at the attendant
// 'axa-elock' - open lock using bluetooth function on phone
// 'open-bikelocker' - open lock using keycode on bike locker
// 'open-keylocker' - open keylocker with given code to get the key
var createLockCode = function(length) {
  var base = Math.pow(10, length+1);
  var code = Math.floor(base + Math.random() * base)
  // console.log('code: ' + code);
  return code.toString().substring(1, length+1);
}

var createLock = function(lockType) {
  var lockInfo = {};

  if(lockType!='axa-elock'&&lockType!='open-bikelocker'&&
     lockType!='open-keylocker'&&lockType!='plainkey') {
      // assume plainkey for unknown keytypes
      lockType='plainkey';
  }

  lockInfo = {
    type: lockType,
    settings: {} // add settings for axa e-lock here
  }

  if(lockType=='plainkey') {
    lockInfo.settings.pickupcode=createLockCode(4);
    lockInfo.settings.returncode=createLockCode(4);
  } else if(lockType=='open-bikelocker') {
    lockInfo.settings.pickupcode=createLockCode(4);
    lockInfo.settings.returncode=createLockCode(4);
  } else if(lockType=='open-keylocker') {
    lockInfo.settings.pickupcode=createLockCode(4);
    lockInfo.settings.returncode=createLockCode(4);
  } else if(lockType=='axa-elock') {

  }


  return lockInfo;
}

var checkTestLocations = function() {
  log('checking default locations');

  _.each(testLocations, function (locationData) {
    var locationId;
    
    var hereitis=Locations.findOne({title: locationData.title});
    if(hereitis) {
      locationId = hereitis._id;
      //  log('check existing location:' + locationData.title);
    } else { 
      locationId = Locations.insert({ 
        title: locationData.title,
        description: locationData.description || '',
        address: locationData.address || '',
        lat_lng: Address2LatLng(locationData.address),
        imageUrl: locationData.imageUrl,
      });
      // log('add new location:' + locationData.title + ' id: ' + locationId);
    }

    var firstproviderid = null;
    _.each(locationData.providers, function (provider) {
      var hithere=Accounts.findUserByEmail(provider);
      if (hithere) {
        if(firstproviderid==null) { 
          firstproviderid = hithere._id;
        }

        log('adding provider ' + provider + ' to ' + locationData.title);
        Meteor.users.update({_id: hithere._id}, {$addToSet: {provider_locations: locationId}} );
      }
    });

    var timestamp =  new Date().valueOf();
    _.each(locationData.bikes, function (bike) {
      var gimmebike=Objects.findOne({locationId: locationId, title: bike.title});
      if (!gimmebike) {

        var lockinfo = null;
        if(!bike.locktype) {
          lockinfo = createLock('plainkey');
        } else {
          lockinfo = createLock(bike.locktype);
        }

        var bikeid = Objects.insert({ 
          locationId: locationId,
          title: bike.title,
          description: bike.description,
          imageUrl: locationData.bikeimage,
          state: { state: bike.state,
                   userId: firstproviderid,
                   timestamp: timestamp },
          lock: lockinfo
        });

        // console.log('add new bike:' + bike.title + ' to location ' + locationData.title);
      }
    });
  });
};    

/* Use settings.json if you want to generate / check testdata when 
   the application starts 
*/
Meteor.startup(() => {
  if(!Meteor.isProduction) {
    if (testdata.cleanup) {
      cleanupTestdata()  // to reset the testdata before each run 
    }

    if (testdata.insert) {
      checkTestUsers()
      checkTestLocations()
    }

    // log( Locations.find().fetch() )
  }
})

