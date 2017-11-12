# Getting started with commonbike and Docker

Here is how to produce a Docker image that runs the commonbike app in a container connecting to another container for MongoDB. 

I started with a clean 16.04 Ubuntu image that has git, docker and docker-compose installed (via apt install).

Then, as `root` run 
```shell
apt update
apt install npm nodejs
npm install -g node-gyp
ln -s /usr/bin/nodejs /usr/bin/node
curl https://install.meteor.com/ | sh
```
Then you install the commonbike app in the following way.
```shell
git clone https://github.com/CommonBike/commonbike-site.git
cd commonbike-site/
cd app
npm install --production
meteor build --verbose --allow-superuser --directory ../mrt_build --server-only
```
Now you we can create the container in the following way. This seems to take more than 8 Gigabytes of memory (I ran it with 12).
```shell
cd ../
docker build --rm=true -t commonbikerc .
```
The argument `-t commonbikerc` shows the name of the new container. This should match the name in the `docker-compose.yml` file. 
Finally you can start the containers with:
```shell
docker-compose up
```
After which you can access the application on `http://localhost:4010` (or whatever the port is that is mentioned in `docker-compose.yml`).

