# Docker Git Hook

This hook will automatically install a MongoDB instance and runs the main Meteor app.

---

## Things you should know:

** Pre-requirements **

 - Meteor installed on the host server
  - Why? Because we compile the Meteor project into a standard NodeJS bundle, outside of docker, so we have a clean reproducible build with less dependencies inside them (since we don't need Meteor).

 - docker and docker-compose
  - install docker with this nice one-liner: `curl -sSL https://get.docker.com/ | sh`
  - for docker-compose: https://docs.docker.com/compose/

** Ports **

 - 4001 is for the linked MongoDB instance.
 - 4000 is the Meteor app.

 Both ports listen ONLY on localhost, so you can't access them from the outside.

 It is recommended to put Nginx or another reverse proxy in from of your server and link to port 4000 from there.

** Data consistency **

The MongoDB instance makes a persistent volume on `/usr/share/commonbike_mdb`. Keep this directory free.

This is to avoid deletion of data when reinstalling the docker instance.
If the Docker instance were to be deleted, the volume will remain.

# How to install

** On the server: **

- Create a new git bare repository: `git init --bare` in any directory you like.
- In the `hooks/` folder of our new repo, add our post-receive file (same folder as which this readme resides.)
- Now add the new repo as remote (i.e `git remote add beta <ssh git folder>`)

Now push from develop using `git push beta develop` and enjoy the automatic builds!
