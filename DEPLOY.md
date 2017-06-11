# Deployment of the CommonBike app

## 1. Server configuration

1. [Create a VPS](http://bartroorda.nl/blog/2016/12/digitalocean-vps)
2. [Set up git hook](http://bartroorda.nl/blog/2016/12/meteor-app)
3. [Configure nginx](http://bartroorda.nl/blog/2016/12/nginx-config)

## 2. Deployment from localhost to server

First, add the server as remote branch.

`git remote add deploy root@common.bike:/var/app/commonbike`

Now choose: where do you want to deploy?

1. To the test environment, test.common.bike?

   `git push deploy branch-you-want-to-deploy:develop`

2. To production, common.bike?

   `git push deploy branch-you-want-to-deploy:master`

Wait a few minutes before the branch is fully deployed. Result: a new deployment!

## 3. Backup the mongo database

There are two ways.

### 1. Using data folder snapshots

You can create a backup of a MongoDB deployment by making a copy of MongoDB’s underlying data files ([docs](https://docs.mongodb.com/manual/core/backups/#back-up-by-copying-underlying-data-files)).

So, to backup the mongo db:

    rsync -avz root@common.bike:/usr/share/commonbike_mdb ~/backup-mongodb

So, to restore the mongo db:

    rsync -avz ~/backup-mongodb/commonbike_mdb/* root@common.bike:~/backup-mongodb
    
NOTE: Since copying multiple files is not an atomic operation, you must stop all writes to the mongod before copying the files.

### 2. Using `mongodump` and `mongorestore`

An easy way to do [mongodb backups](https://docs.mongodb.com/manual/core/backups/#back-up-with-mongodump) on the server is using `[mongodump](https://docs.mongodb.com/manual/reference/program/mongodump/#bin.mongodump)` and `[mongorestore](https://docs.mongodb.com/manual/reference/program/mongorestore/#bin.mongorestore)`. 

First log in to the server:

    ssh root@common.bike -C

Log in into the Docker container used for mongo:

    docker exec -it deploy_db_1 bash

Backup the database:

    mongodump -h 127.0.0.1 --port 27017 --out /data/backup/20180101 -d commonbike

*If you want to restore the database in a later stage:*

    mongorestore -h 127.0.0.1 --port 27017 /data/backup/20180101 -d commonbike
