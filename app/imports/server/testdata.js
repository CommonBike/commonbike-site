import { Meteor } from 'meteor/meteor';
import { Locations, Address2LatLng } from '/imports/api/locations.js';
import { Objects } from '/imports/api/objects.js';
import { Transactions } from '/imports/api/transactions.js';
import '/imports/api/users.js';
import { getUserDescription } from '/imports/api/users.js';
import BikeCoin from '/imports/api/bikecoin.js';

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
     password:"common!!",roles:[],
     avatar:"/files/Testdata/lockers.png"},
    {name:"easyfiets",email:"easyfiets@commonbike.com",
     password:"easyfiets!!", roles:[],
     avatar:"/files/Testdata/easyfiets-logo.jpg"},
    {name:"tourist1",email:"tourist1@commonbike.com",
     password:"common!!", roles:[] },
     {name:"tourist2",email:"tourist2@commonbike.com",
     password:"common!!", roles:[]},
  ];

var testLocations = [
  {title:"J156A",
   address: "Jutfaseweg 156A, Utrecht, Netherlands",
   imageUrl:'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bike-256.png',
   providers:["j156a@commonbike.com", "user1@commonbike.com"],
   bikeimage: '/files/Block/bike.png',
   bikes: [ { title: 'Skopei Demo Bike (160020)', description: 'de Skopei fiets met nummer 160020', state: 'available',
              locktype: 'skopei-v1', locksettings: { elockid: '160020'}},
            { title: 'Skopei Demo Bike (160021)', description: 'de Skopei fiets met nummer 160021 ', state: 'available',
              locktype: 'skopei-v1', locksettings: { elockid: '160021'}},
            { title: 'Skopei Demo Bike (170178)', description: 'de Skopei fiets met nummer 170178', state: 'available',
              locktype: 'skopei-v1', locksettings: { elockid: '170178'}},
            { title: 'GoAbout Demo Bike', description: 'de GoAbout fiets met nummer xxxx', state: 'available',
              locktype: 'goabout-v1', locksettings: { elockid: '170178', code: 'asdfasdfasdfasdfasdf' }},
            { title: 'OpenELock Demo Bike', description: 'de CommonBike Elock fiets met nummer xxxx', state: 'available',
              locktype: 'open-elock', locksettings: { elockid: '0611', code: 'herewegonow' }},
            // { title: 'Batavus 1 (AXA)', description: 'Fietsnr. 1122', state: 'available',
            //   locktype: 'axa-elock', locksettings: { connectionname: 'AXA lock EFGGGHA1321', pincode: '00908'}},
            // { title: 'Batavus 2 (KeyLocker)', description: 'Fietsnr. 1134', state: 'available',
            //   locktype: 'open-keylocker', locksettings: { keylocker: 1, pincode: '3692'}},
            // { title: 'Batavus 3', description: 'Fietsnr. 1145', state: 'available',
            //   locktype: 'open-keylocker', locksettings: { keylocker: 2, pincode: '7834'}},
            // { title: 'Batavus 4', description: 'Fietsnr. 1165', state: 'available'},
            // { title: 'Batavus 5', description: 'Fietsnr. 1166', state: 'outoforder'}
              ]
  },
  {title:"S2M",
   description: "The heart and mind",
   address:"Moreelsepark 65, Utrecht, Netherlands",
   imageUrl:'https://cdn1.iconfinder.com/data/icons/UrbanStories-png-Artdesigner-lv/256/Bicycle_by_Artdesigner.lv.png',
   providers:["s2m@commonbike.com", "user2@commonbike.com"],
   bikeimage: '/files/Block/bike.png',
   bikes: [ { title: 'Skopei Demo Bike', description: 'Skopei demonstratiefiets met eLock', state: 'available'},
            { title: 'Giant 1', description: 'Damesfiets 33879', state: 'available'}, ]
  },
  {title:"Lockers Zeist",
   address:"Utrechtseweg 2, 3732 HB De Bilt, Netherlands",
   lat_lng: [52.098325, 5.212101],
   imageUrl:'/files/Testdata/lockers.png',
   providers:["zeist@commonbike.com", "user1@commonbike.com"],
   bikeimage: '/files/Testdata/locker.png',
   bikes: [ { title: 'Bikelocker A', description: 'Linkerkluis', state: 'available',
              locktype: 'open-bikelocker'},
            { title: 'Bikelocker B', description: '1e kluis van links', state: 'available',
              locktype: 'open-bikelocker'},
            { title: 'Bikelocker C', description: '2e kluis van links', state: 'available',
              locktype: 'open-bikelocker'},
            { title: 'Bikelocker D', description: '3e kluis van links', state: 'available',
              locktype: 'open-bikelocker'},
            { title: 'Bikelocker E', description: '3e kluis van rechts', state: 'outoforder',
              locktype: 'open-bikelocker'},
            { title: 'Bikelocker F', description: '2e kluis van rechts', state: 'outoforder',
              locktype: 'open-bikelocker'},
            { title: 'Bikelocker G', description: '1e kluis van rechts', state: 'outoforder',
              locktype: 'open-bikelocker'},
            { title: 'Bikelocker H', description: 'rechterkluis', state: 'available',
              locktype: 'open-bikelocker'} ]
  },
  {title:"Easyfiets - Bij Leiden CS",
   address: "Bargelaan 68, 2333 CV Leiden",
   lat_lng: [ 52.166636, 4.481510],
   imageUrl:'/files/Testdata/easyfiets-logo.jpg',
   providers:["easyfiets@commonbike.com"],
   bikeimage: '/files/Testdata/easyfiets-bike.jpg',
   bikes: [ { title: 'Easyfiets 1', description: 'Herenfiets', state: 'available',
              locktype: 'plainkey', locksettings: { keyid: '1001' }},
            { title: 'Easyfiets 5', description: 'Damesfiets', state: 'available',
              locktype: 'plainkey', locksettings: { keyid: '2361' }} ]
  },
  // {title:"Easyfiets - Bij Leiden Lammenschans",
  //  address: "Kamerlingh Onnesplein 4, 2313 VL Leiden, the Netherlands",
  //  lat_lng: [52.146937, 4.492933],
  //  imageUrl:'/files/Testdata/easyfiets-logo.jpg',
  //  providers:["easyfiets@commonbike.com"],
  //  bikeimage: '/files/Testdata/easyfiets-bike.jpg',
  //  bikes: [ { title: 'Easyfiets 2', description: 'Herenfiets', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '2334' }},
  //           { title: 'Easyfiets 3', description: 'in het easyfiets rek', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '1789' }},
  //           { title: 'Easyfiets 4', description: 'in het easyfiets rek', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '2662' }} ,
  //           { title: 'Easyfiets 8', description: 'in het easyfiets rek', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '9366' }} ,
  //           { title: 'Easyfiets 11', description: 'in het easyfiets rek', state: 'outoforder',
  //             locktype: 'plainkey', locksettings: { keyid: '4425' }}  ]
  // },
  // {title:"Easyfiets - Haagweg",
  //  address: "Haagweg 8, Leiden, the Netherlands",
  //  lat_lng: [52.158957, 4.478508],
  //  imageUrl:'/files/Testdata/easyfiets-logo.jpg',
  //  providers:["easyfiets@commonbike.com"],
  //  bikeimage: '/files/Testdata/easyfiets-bike.jpg',
  //  bikes: [ { title: 'Easyfiets 6115', description: 'in het easyfiets rek', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '6115' }},
  //           { title: 'Easyfiets 123', description: 'in het easyfiets rek', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '123' }},
  //           { title: 'Easyfiets 17', description: 'in het easyfiets rek', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '17' }} ,
  //           { title: 'Easyfiets 21', description: 'in het easyfiets rek', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '21' }} ,
  //           { title: 'Easyfiets 33', description: 'in het easyfiets rek', state: 'available',
  //             locktype: 'plainkey', locksettings: { keyid: '33' }}  ]
  // }
];

export const cleanupTestUsers = function() {
  _.each(testUsers, function (userData) {
    var hithere=Accounts.findUserByEmail(userData.email);
    if(hithere) {
      // logout user prior to deleting
      Meteor.users.update({_id:hithere}, {$set: { "services.resume.loginTokens" : [] }});

      var id = hithere._id;

      _.each(userData.roles, function (role) {
          if (Roles.userIsInRole(id, [role])) {
              Roles.removeUsersFromRoles(id, [role]);
            }
        });

      Transactions.remove({userId: id});
      Meteor.users.remove({_id: id});
    }
  });
}

export const cleanupTestData = function() {
  _.each(testLocations, function (locationData) {
    var hereitis=Locations.findOne({title: locationData.title});
    if(hereitis) {
        var id = hereitis._id;

        // remove all objects for this location
        var myObjects = Objects.find({locationId: id}).fetch();
        _.each(myObjects, function (object) {
          Transactions.remove({objectId: object._id});
        });

        Objects.remove({locationId: id});

        Transactions.remove({locationId: id});
        Locations.remove({_id: id});
    }
  });
}

const GetRandomAvatar = () => {
  const url = 'https://randomuser.me/api/'
  const response = HTTP.get(url)
  const obj = JSON.parse(response.content)
  const avatar_url = obj.results[0].picture.large

  return avatar_url
}

export const checkTestUsers = function() {
    _.each(testUsers, function (userData) {
      var id;

      var hithere=Accounts.findUserByEmail(userData.email);
      if(hithere) {
      id = hithere._id;
    } else {
      // assign new keypair to object
      var keypair = BikeCoin.newKeypair();

      id = Accounts.createUser({
        email: userData.email,
        password: userData.password,
        profile: { name: userData.name,
                   avatar: userData.avatar || GetRandomAvatar(),
                   wallet: {
                     address:keypair.address,
                     privatekey:keypair.privatekey
                   }
        }
      });

      var anavatar = GetRandomAvatar();
      Meteor.users.update({_id: id}, {$set:{'avatar': anavatar}});

      // email verification
      Meteor.users.update({_id: id}, {$set:{'emails.0.verified': true, 'profile.active':true}});
      Meteor.call('transactions.registerUser', id);
    }

    _.each(userData.roles, function (role) {
        if (!Roles.userIsInRole(id, [role])) {
          Roles.addUsersToRoles(id, [role]);
        }
      });
    });
}

var createLockCode = function(length) {
  var base = Math.pow(10, length+1);
  var code = Math.floor(base + Math.random() * base)
  return code.toString().substring(1, length+1);
}

var createLock = function(locktype, locksettings,object) {
  var lockInfo = {};

  if(locktype!='axa-elock'&&locktype!='goabout-v1'&&locktype!='skopei-v1'&&locktype!='open-bikelocker'&&
     locktype!='open-keylocker'&&locktype!='open-elock'&&locktype!='plainkey') {
      // assume plainkey for unknown keytypes
      locktype='plainkey';
  }

  lockInfo = {
    type: locktype,
    settings: {} // add settings for axa e-lock here
  }

  if(locktype=='plainkey'||locktype=='open-bikelocker') {
    lockInfo.settings = Object.assign({keyid: '0000' }, locksettings);
  } else if(locktype=='open-keylocker') {
    lockInfo.settings = Object.assign({keylocker: 1, pincode: '1234'}, locksettings);
  } else if(locktype=='axa-elock') {
    lockInfo.settings = Object.assign({connectionname: 'AXA_HALLORONALD', pincode: '11111'}, locksettings);
  } else if(locktype=='skopei-v1') {
    lockInfo.settings = Object.assign({elockid: 'xxxxxx'}, locksettings);
  } else if(locktype=='goabout-v1'||locktype=='open-elock') {
    lockInfo.settings = Object.assign({elockid: 'xxxxxx', code: 'asdfadsfadsfasdfasdfasdf'}, locksettings);
  }

  return lockInfo;
}

export const checkTestLocations = function() {
  _.each(testLocations, function (locationData) {
    var locationId;


    var hereitis=Locations.findOne({title: locationData.title});
    if(hereitis) {
      locationId = hereitis._id;
    } else {
      if(!locationData.lat_lng) {
        locationData.lat_lng=Address2LatLng(locationData.address);
      }

      locationId = Locations.insert({
        title: locationData.title,
        description: locationData.description || '',
        address: locationData.address || '',
        lat_lng: locationData.lat_lng,
        imageUrl: locationData.imageUrl,
      });
    }

    var firstproviderid = null;
    _.each(locationData.providers, function (provider) {
      var hithere=Accounts.findUserByEmail(provider);
      if (hithere) {
        if(firstproviderid==null) {
          firstproviderid = hithere._id;
          firstprovidermail=hithere.emails[0].address;
        }

        Meteor.users.update({_id: hithere._id}, {$addToSet: {'profile.provider_locations': locationId}} );
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
          lockinfo = createLock(bike.locktype, bike.locksettings);
        }

        var priceinfo = {
          value: '0',
          currency: 'euro',
          timeunit: 'day',
          description: 'tijdelijk gratis'
        };

        // assign new keypair to object
        var keypair = BikeCoin.newKeypair();

        var walletinfo = {
          address:keypair.address,
          privatekey:keypair.privatekey
        }

        var keyid = Objects.insert({
          locationId: locationId,
          title: bike.title,
          description: bike.description,
          imageUrl: locationData.bikeimage,
          state: { state: bike.state,
                   userId: firstproviderid,
                   timestamp: timestamp,
                   userDescription: '' },
          lock: lockinfo,
          price: priceinfo,
          wallet: walletinfo
        });
      }
    });
  });
};

Meteor.methods({
  'testdata.cleanupTestUsers'(data) {
    // Make sure the user is logged in
    if (!Meteor.userId||!Roles.userIsInRole( this.userId, 'admin' )) throw new Meteor.Error('not-authorized');

    cleanupTestUsers();

    var description = "Testgebruikers verwijderd door " + getUserDescription(Meteor.user());
    Meteor.call('transactions.addTransaction', 'ADMIN_CLEANUP_TESTUSERS', description, this.userid, null, null, null);

  },
  'testdata.cleanupTestData'(data) {
    // Make sure the user is logged in
    if (!Meteor.userId||!Roles.userIsInRole( this.userId, 'admin' )) throw new Meteor.Error('not-authorized');

    cleanupTestData();

    var description = "Testdata verwijderd door " + getUserDescription(Meteor.user());
    Meteor.call('transactions.addTransaction', 'ADMIN_CLEANUP_TESTUSERS', description, this.userid, null, null, null);
  },
  'testdata.checkTestUsers'(data) {
    // Make sure the user is logged in
    if (!Meteor.userId||!Roles.userIsInRole( this.userId, 'admin' )) throw new Meteor.Error('not-authorized');

    checkTestUsers();

    var description = "Testgebruikers toegevoegd door " + getUserDescription(Meteor.user());
    Meteor.call('transactions.addTransaction', 'ADMIN_CLEANUP_TESTUSERS', description, this.userid, null, null, null);
  },
  'testdata.checkTestLocations'(data) {
    // Make sure the user is logged in
    if (!Meteor.userId||!Roles.userIsInRole( this.userId, 'admin' )) throw new Meteor.Error('not-authorized');

    checkTestLocations();

    var description = "Testdata toegevoegd door " + getUserDescription(Meteor.user());
    Meteor.call('transactions.addTransaction', 'ADMIN_CLEANUP_TESTUSERS', description, this.userid, null, null, null);
  }
});
