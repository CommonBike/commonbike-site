# CommonBike App

This repository exists of the Meteor-app for CommonBike.

# Prerequisites

For this app we use the Meteor framework. Please install Meteor first. See [meteor.com](https://www.meteor.com/).

# How do I run run the app?

- `cd path-of-this-git-repository/app`
- `meteor --settings settings.json`

Server is now running at [localhost:3000](http://localhost:3000)

# How do I run run the Docker file

`cd app/ && meteor build ../mrt_build`
`docker build -t commonbike .` (notice the dot)

# What code libraries and techniques are used?

- [Meteor](https://www.meteor.com/): main application framework
- [React](https://facebook.github.io/react/): *one way data binding* library
- 
#- [CoffeeScript](http://coffeescript.org/): write code in less time
- [Ramda](http://ramdajs.com/): functional programming in JavaScript
- [Fluture](https://github.com/Avaq/Fluture): Futures in JavaScript
