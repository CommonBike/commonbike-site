
if(!Meteor.isServer) {
	export const Backuplist = new Mongo.Collection('backuplist');
}

if (Meteor.isServer) {
	import { getSettingsServerSide } from '/imports/api/settings.js';

	function getBackupName() {
	    function pad(num) {
	        num = num + '';
	        return num.length < 2 ? '0' + num : num;
	    }

			var date = new Date();

	    return 'commonbike_' + date.getFullYear() +
	           pad(date.getMonth() + 1) +
	           pad(date.getDate()) + '_' +
	           pad(date.getHours()) +
	           pad(date.getMinutes()) +
	           pad(date.getSeconds());
	}

	function getRestoreList() {

	}

	Meteor.publish('backuplist', function backupList() {
		if (!this.userId||!Roles.userIsInRole(this.userId, 'admin' )) {
			this.ready();
			return;
		}

		console.log(`fetching list with backups`);

		var backuppath = getSettingsServerSide().backup.location;
	  var fs = require('fs');

	  if (fs.existsSync(backuppath)) {
			  dirs = fs.readdirSync(backuppath).filter(function (file) {
			    	return fs.statSync(backuppath+'/'+file).isDirectory();
		  	});

				_.each(dirs, (dir)=>this.added('backuplist', Random.id(), {name: dir}));
	  } else {
	    console.log('backup path does not exist');
	  }

	  this.ready();
	});

	Meteor.methods({
    'databasetools.backup'() {
      // if (!this.userId||!Roles.userIsInRole( this.userId, 'admin' )) throw new Meteor.Error('not-authorized');
			//
      // var backup = require('mongodb-backup');
			//
			// console.log('Make sure that meteor has read/write access to ' + getSettingsServerSide().backup.location);
			// console.log('Otherwise backup will fail');
			//
			// var fs = require('fs');
			// var rootdir = fs.realpathSync(getSettingsServerSide().backup.location);
			// if (!fs.existsSync(rootdir)) {
			// 	console.log("create backup root folder " + rootdir)
    	// 	fs.mkdirSync(rootdir);
			// }
			//
			// // NB: tar option would be nice, but does not work in meteor setup (creates path in node_modules tree)
			// var backupdir = rootdir + '/' + getBackupName();
			// console.log('backup to ' + backupdir);
      // backup({
      //   uri: 'mongodb://localhost:3001/meteor', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
      //   root:  backupdir,
			// 	logger: rootdir + '/meteor_backup.log',
			// 	callback: (err) => { if(err) { console.error(err) } else { console.log('backup success') } }
      // });
			//
      // console.log('database backup complete');
    },
		'databasetools.restore'(name) {
		// 	if (!this.userId||!Roles.userIsInRole( this.userId, 'admin' )) throw new Meteor.Error('not-authorized');
		//
		// 	Meteor.call('databasetools.backup');	// always backup before restore
		//
		// 	var fs = require('fs');
		// 	var rootdir = fs.realpathSync(getSettingsServerSide().backup.location);
		// 	var backupdir = rootdir + '/' + name + '/';
		// 	if (!fs.existsSync(backupdir)) {
		// 		return;
		// 	}
		//
		// 	var restore = require('mongodb-restore');
		// 	console.log('restore from ' + backupdir);
		//
		// 	restore({
		// 		uri: 'mongodb://localhost:3001/meteor', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
		// 		root:  backupdir + 'meteor', // nb need the original database name here otherwise it will not work
		// 		drop: false,
		// 		logger: rootdir + '/meteor_restore.log',
		// 		callback: (err) => { if(err) { console.error(err) } else { console.log('restore success') } }
		// 	});
		//
		// 	console.log('database restore complete');
		}
  })
}
