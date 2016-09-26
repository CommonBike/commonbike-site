## Deploying the app to the server

### 2.1 Local configuration

1. Create `/etc/rsyncd.motd` on your local filesystem, see `./deploy/examples/rsyncd.motd`
2. Create `/etc/rsyncd.commonbike-site.scrt` on your local filesystem, see `./deploy/examples/rsyncd.commonbike-site.scrt`

### 2.2 Building & uploading the app

In your local branch, run:

1. `./deploy.sh`

### 2.3 Run the app on the server

1. Create a SSH tunnel to the server
2. Run the contents of `./deploy/deploy-server.sh` on the server

### 2.4 Server configuration

1. `vi /etc/apache2/sites-available/go.common.bike.vhost`
2. Paste the contents of `./deploy/examples/go.common.bike.vhost`
3. Save the file
2. Symlink `sites-available/go.common.bike.vhost` to `sites-enabled/go.common.bike.vhost`
4. Restart apache
