# Setting up Travis for continuous delivery to Heroku
Build platform: Travis. Deployment to: Heroku.

This application should be live at https://pve-commonbike-site-develop.herokuapp.com/.
If you fork this, you should adapt this to the name you set up in Heroku.

# Instructions for getting started.

Required to get this working:
- Travis account (free)
- Heroku account (credit card required, but enough free resources)

# Travis

In the Travis settings you need to set (adapt) HEROKU_API_KEY with you Heroku API key.

Adapt .travis.yml, to reflect your application name, and then you are ready to trigger a build by pushing to the master branch.

Travis build status: 
[![Build Status](https://api.travis-ci.org/pve/commonbike-site.svg?branch=develop)](https://travis-ci.org/pve/commonbike-site), adapt this to the right travis link.

# Heroku

You might need the Heroku CLI for setting it up.
```
wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh
```
Once the pipeline works, these are no longer required.

Note that in the next lines, 'example' is the Heroku name of the
application, and should be unique across all Heroku accounts. 
As a naming convention, you might want to use the repository owner, name and version branch in the application name.
Heroku --help is your friend.

The following are one time setup commands. Make sure to use the proper MONGODB_URI.
```
heroku apps:create example --region eu 
heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git
heroku addons:create mongolab:sandbox
heroku config | grep MONGODB_URI
heroku config:add MONGO_URL=<MONGODB_URI value>
heroku config:add ROOT_URL=https://example.herokuapp.com
```
# Setting up notifications
Github to Slack is set up in Slack -> Integrations/App Directory

Travis to Slack is set up in Slack -> Integrations/App Directory, which also needs to be reflected in the .travis.yml file.

Heroku to Slack:

Consult https://stackoverflow.com/questions/45604177/slack-heroku-send-notification-to-slack-whenever-my-heroku-app-is-down

Command line:
```
heroku addons:create deployhooks:http
```
On the Heroku dashboard you will have to look under 'installed add-ons' for further configuration.

Beyond this, you need to fiddle with webhooks, IFTTT or Zapier.

