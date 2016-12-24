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
