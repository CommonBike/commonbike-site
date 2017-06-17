# Develop

## Contents

- [How to start](#1-how-to-start)
- [How to run the app](#2-how-to-run-the-app)
- [Configuring login services](#3-configuring-login-services-like-facebook-and-twitter)
- [Used libraries](#4-used-libraries)
- [Used techniques](#5-used-techniques)
- [Testing](#6-testing)
- [Future plans / Participate!](#future-plans--participate)

## 1. How to start

**1.1 Install Meteor**

For this app we use the Meteor framework. Please install Meteor first. See [meteor.com](https://www.meteor.com/).

**1.2 Install npm modules**

1. `cd folderOfYourProject`
2. `meteor npm install`

**1.3 Install git flow for easy branching**

1. Install [git flow](https://github.com/nvie/gitflow) ([install guide](https://github.com/nvie/gitflow/wiki/Installation))

    `sudo apt-get install git-flow`

2. Initialize git flow

    `cd commonbike-site && git flow init`

3. Use git flow ([cheatsheet](http://danielkummer.github.io/git-flow-cheatsheet/))

## 2. How to run the app

This is how you run the app:

1. `cd path-of-this-git-repository/app`
2. `meteor --settings settings.json`

Server is now running at [localhost:3000](http://localhost:3000).

## 3. Configuring login services like Facebook and Twitter

Configuring the login services is easy. Just go to [/commonbike-ui](http://localhost:3000/commonbike-ui). On this page you'll a bunch of UI components on one page. The first one, **Basic UI component**, shows a basic login/register module. Use this module to configure all the login services you prefer.

See [guide.meteor.com/accounts](https://guide.meteor.com/accounts.html#accounts-ui) for more information about this topic.

## 4. Used libraries

What code libraries are used?

- For mobile swiping: [react-swipe](https://github.com/voronianski/react-swipe)
- For UI elements: [material-ui](http://www.material-ui.com/)
- [meteor-simple-schema](https://github.com/aldeed/meteor-simple-schema) - A simple, reactive schema validation package for Meteor
- [react-contenteditable](https://github.com/lovasoa/react-contenteditable) - React component for a div with editable contents
- [draft.js](http://facebook.github.io/draft-js/) - Rich text editor framework for react
- [Meteor](https://www.meteor.com/): main application framework
- [React](https://facebook.github.io/react/): *one way data binding* library
- [Ramda](http://ramdajs.com/): functional programming in JavaScript
- [Fluture](https://github.com/Avaq/Fluture): Futures in JavaScript

## 5. Used techniques

What code techniques are used?

- Semantic versioning ([semver](https://docs.npmjs.com/getting-started/semantic-versioning))

## 6. Testing

- A test script can be found at ([testscript](https://docs.google.com/spreadsheets/d/1JcdxosiQe3FDUTKkx9ksgosLR1Stom-sKoKXga8RATo/edit?usp=sharing))

## Future plans / Participate!

Join the CommonBike [Slack](http://slack.common.bike) channel :party:

&raquo; [How to participate](https://github.com/CommonBike/wiki/wiki/How-to-participate).
