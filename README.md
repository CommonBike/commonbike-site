# CommonBike App 1.0.0

We are on a mission to create open source locks and bike sharing.

This is the (web) app of CommonBike. With this app you can open locks that are connected to the free and open CommonBike lock system.

- [Project website](http://common.bike)
- [Documentation](https://github.com/CommonBike/commonbike-documentation/wiki)

## Contents

- [Demo](#1-demo)
- [Development](#2-development)
- [Deployment](#3-deployment)
- [Future plans](#4-future-plans)

## 1. Demo

Go to [common.bike](https://go.common.bike) for a live demo.

## 2. Development

### Prerequisites

* Install [git flow](https://github.com/nvie/gitflow)
  `sudo apt-get install git-flow`
  Or try: [Install guide](https://github.com/nvie/gitflow/wiki/Installation)
* Initialize git flow
  `cd commonbike-site`
  [`git flow init`](https://github.com/nvie/gitflow/wiki/Command-Line-Arguments#git-flow-init--fd)

### Running the app

1. `cd folderOfYourProject`
2. `meteor`
3. Go to localhost:3000 to see the app running

### Used libraries

- For mobile swiping: [react-swipe](https://github.com/voronianski/react-swipe)
- For UI elements: [material-ui](http://www.material-ui.com/)
- [meteor-simple-schema](https://github.com/aldeed/meteor-simple-schema) - A simple, reactive schema validation package for Meteor
- [react-contenteditable](https://github.com/lovasoa/react-contenteditable) - React component for a div with editable contents
- [draft.js](http://facebook.github.io/draft-js/) - Rich text editor framework for react

## 3. Deployment

See [DEPLOY.md](DEPLOY.md) for information about deployment on the server.

## 4. Future plans

To be continued.
