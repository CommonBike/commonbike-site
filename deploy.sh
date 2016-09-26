# Build commonbike-site

meteor build --directory ../commonbike-site--master

# Upload app to server

rsync --verbose  --progress --stats --compress --rsh='/usr/local/bin/ssh -p 10622' \
      --recursive --times --perms --links --delete \
      --exclude "*bak" --exclude "*~" \
      ~/htdocs/commonbike-site--master/* tuxion@go.common.bike:commonbike-site
      # ^ commonbike-site configuration can be found in /etc/rsyncd.conf
