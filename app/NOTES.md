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

- Create a dedicated channel for the commonbike-bot
- Add an incoming webhook:
* In the slack backend:
  - Build from top menu
  - Incoming webhooks
  - choose existing channel or create a new one
  - Add incoming webhook integration
  - Copy webhook URL to settings.json in application root (slack section)
  - fill in other info (channel name without hash, bot name)
  - enable notifications
  - voila....
  
