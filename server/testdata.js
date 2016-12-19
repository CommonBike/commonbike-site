import { Meteor } from 'meteor/meteor';
import { Locations } from '/imports/api/locations.js'; 
import { Objects } from '/imports/api/objects.js'; 

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
   imageUrl:'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/bike-256.png',
   admins:["j156a@commonbike.com", "user1@commonbike.com"],
   bikeimage: '/files/Block/bike.png',
   bikes: [ { title: 'Batavus 1', description: 'Fietsnr. 1122'}, 
            { title: 'Batavus 2', description: 'Fietsnr. 1134'}, 
            { title: 'Batavus 3', description: 'Fietsnr. 1145'},
            { title: 'Batavus 4', description: 'Fietsnr. 1166'} ]
  },
  {title:"S2M",
   imageUrl:'https://cdn1.iconfinder.com/data/icons/UrbanStories-png-Artdesigner-lv/256/Bicycle_by_Artdesigner.lv.png',
   admins:["s2m@commonbike.com", "user2@commonbike.com"],
   bikeimage: '/files/Block/bike.png',
   bikes: [ { title: 'Giant 1', description: 'Damesfiets 33879'}, 
            { title: 'Giant 2', description: 'Damesfiets 33277 (met kinderzit)'}, 
            { title: 'Giant 3', description: 'Herenfiets 31119'},
            { title: 'Bakfiets', description: 'Bakfiets'} ]
  },
  {title:"Lockers Zeist",
   imageUrl:'/files/Testdata/lockers.png',
   admins:["zeist@commonbike.com"],
   bikeimage: '/files/Testdata/locker.png',
   bikes: [ { title: 'Bikelocker A', description: 'Linkerkluis'}, 
            { title: 'Bikelocker B', description: '1e kluis van links'}, 
            { title: 'Bikelocker C', description: '2e kluis van links'},
            { title: 'Bikelocker D', description: '3e kluis van links'},
            { title: 'Bikelocker E', description: '3e kluis van rechts'}, 
            { title: 'Bikelocker F', description: '2e kluis van rechts'}, 
            { title: 'Bikelocker G', description: '1e kluis van rechts'},
            { title: 'Bikelocker H', description: 'rechterkluis'} ]
  }
];

var cleanupTestdata = function() {
  _.each(testUsers, function (userData) {
    var hithere=Accounts.findUserByEmail(userData.email);
    if(hithere) {
      var id = hithere._id;

      _.each(userData.roles, function (role) {
          if (Roles.userIsInRole(id, [role])) {
            console.log('removing user ' + userData.name + ' from role ' +role);
              Roles.removeUsersFromRoles(id, [role]);
            }
        });

      Meteor.users.remove({_id: id});
      console.log('removed test user ' + userData.name);
    } 
  });

  _.each(testLocations, function (locationData) {
    var hereitis=Locations.findOne({title: locationData.title});
    if(hereitis) {
        var id = hereitis._id;
        Locations.remove({_id: id});
        console.log('removing location:' + locationData.title + ' id: ' + id);
    }
  });
}

var checkTestUsers = function() {
    console.log('checking default users');

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
      console.log('added test user ' + userData.name);
    }

    _.each(userData.roles, function (role) {
        if (!Roles.userIsInRole(id, [role])) {
          console.log('adding user ' + userData.name + ' to role ' +role);
            Roles.addUsersToRoles(id, [role]);
          }
      });
    });    
}

var checkTestLocations = function() {
  console.log('checking default locations');

  _.each(testLocations, function (locationData) {
    var id;
    
    var hereitis=Locations.findOne({title: locationData.title});
    if(hereitis) {
        id = hereitis._id;
//        console.log('check existing location:' + locationData.title);
    } else {
        id = Locations.insert({ 
          title: locationData.title,
          imageUrl: locationData.imageUrl,
        });
//        console.log('add new location:' + locationData.title + ' id: ' + id);
    }

    _.each(locationData.admins, function (admin) {
      var hithere=Accounts.findUserByEmail(admin);
      if (hithere) {
        // console.log('adding admin ' + admin + ' to  ' + locationData.title);
        Locations.update({_id: id}, {$addToSet: {admins: hithere._id}} 
        );
      }
    });

    _.each(locationData.bikes, function (bike) {
      var gimmebike=Objects.findOne({locationId: id, title: bike.title});
      if (!gimmebike) {
        var bikeid = Objects.insert({ 
          locationId : id,
          title: bike.title,
          description : bike.description,
          imageUrl: locationData.bikeimage
        });

//        console.log('add new bike:' + bike.title + ' to location ' + locationData.title);
    }
    });
  });
};    

/* Uncomment the code below if you want to generate / check testdata when 
   the application starts 

Meteor.startup(() => {

  if(!Meteor.isProduction) {
    // add cleanupTestdata()  to reset the testdata before each run 

    checkTestUsers();

    checkTestLocations();
  }
});
*/