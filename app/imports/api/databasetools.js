
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

	Meteor.methods({
    'databasetools.backup'() {
      if (!Meteor.userId()||!Roles.userIsInRole( Meteor.userId(), 'admin' )) throw new Meteor.Error('not-authorized');

      var backup = require('mongodb-backup');

			console.log('Make sure that meteor has read/write access to ' + getSettingsServerSide().backup.location);
			console.log('Otherwise backup will fail');

			var fs = require('fs');
			var rootdir = fs.realpathSync(getSettingsServerSide().backup.location);
			if (!fs.existsSync(rootdir)) {
				console.log("create backup root folder " + rootdir)
    		fs.mkdirSync(rootdir);
			}

			// NB: tar option would be nice, but does not work in meteor setup (creates path in node_modules tree)
			var backupdir = rootdir + '/' + getBackupName();
			console.log('backup to ' + backupdir);
      backup({
        uri: 'mongodb://localhost:3001/meteor', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
        root:  backupdir,
        logger: '/var/log/meteor_backup.log',
				parser: 'json',
        callback: (err,success) => { console.log(err||success)}
      });

      console.log('database backup complete');

    },
  })
}
