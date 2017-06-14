# What I did to make slack.common.bike work [bartwr]

I used https://github.com/rauchg/slackin

## On the server

- `sudo npm install -g slackin`
- `forever start /usr/local/bin/slackin -p 3010 "commonbike" "MY TEST KEY"`

To the Apache vhost of slack.common.bike I added:

    SetEnv PORT 3010
    SetEnv ROOT_URL http://slack.common.bike

    ServerName slack.common.bike
    ServerAdmin webmaster@common.bike

    ProxyPass / http://127.0.0.1:3010/ retry=0
    ProxyPassReverse / http://127.0.0.1:3010/



## what I did to resolve the error 'Error: Cannot find module 'is-property' when executing meteor add-platform android on windows [mb]

This is a confirmed issue: see https://github.com/meteor/meteor/issues/7358

cd to
C:\Users\YOURUSERNAME\AppData\Local\.meteor\packages\meteor-tool\1.4.2_3\mt-os.windows.x86_32\dev_bundle\lib\node_modules\cordova-lib\node_modules\npm\node_modules\request\node_modules\har-validator\node_modules\is-my-json-valid

run
meteor npm install is-property

After that, go back to your project directory and try running meteor add-platform android again and it should work.

## messages on a slack channel? (mb)

- Create a dedicated slack channel for the commonbike-bot
- Add an incoming webhook:
* In the slack backend:
  - **Build** from top menu
  - Search for **Incoming webhooks**
  - Choose existing channel or create a new one
  - Add incoming webhook integration
  - Copy webhook URL to settings.json in application root (slack section)
  - Fill in other info (channel name without hash, bot name)
  - enable notifications
  - voila....

## what i did to copy the remote database to my local installation (mb)

Backup database to folder

Start meteor in one terminal, open another terminal and use commands below

Local database

	mongodump -v -h 127.0.0.1 --port 3001 -d meteor -o ~/backup-commonbike/2017xxxx_localhost

  (stores database in 2017xxxx_localhost/meteor)

Remote database:

	create ssh tunnel to remote server 4011 -> 4011
	[ .ssh/config: LocalForward 4011 localhost:4011 ]

	mongodump -v -h 127.0.0.1 -d commonbike --port 4011 -o ~/backup-commonbike/2017xxxx_develop_commonbike

  (stores database in 2017xxxx_develop_commonbike/commonbike)

Restore database to local:
  * Use -d databasename to specify where the database should be restored (default local = meteor)

	mongorestore -d <target database name> -h 127.0.0.1 --port 3001 --drop ~/backup-commonbike/2017xxxx_localhost/meteor

## what to do when the backup has no files (mb) -> wrong version of mongodump / mongorestore

When mongodump creates empty directory: probably caused by a version mismatch between mongodb and the tools

Run meteor mongo command to see shell version:

	MongoDB shell version: 3.2.12

Run mongodump --version to see tool version

fix:
[From
	https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04
	https://stackoverflow.com/questions/43896851/meteor-mongodump-doesnt-extract-data-produces-empty-directory
]

Ubuntu ensures the authenticity of software packages by verifying that they are signed with GPG keys, so we first have to import they key for the official MongoDB repository.

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

After successfully importing the key, you will see:

Output gpg: Total number processed: 1 gpg: imported: 1 (RSA: 1) Next, we have to add the MongoDB repository details so apt will know where to download the packages from.

Issue the following command to create a list file for MongoDB.

echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list After adding the repository details, we need to update the packages list.

sudo apt-get update

<stop>

only install tools:

sudo apt-get install mongodb-org-tools
