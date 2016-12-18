# Develop

## Prerequisites

**Install dependencies**

1. `cd folderOfYourProject`
2. `meteor npm install`

**Install git flow for easy branching**

* Install [git flow](https://github.com/nvie/gitflow)
  `sudo apt-get install git-flow`
  Or try: [Install guide](https://github.com/nvie/gitflow/wiki/Installation)
* Initialize git flow
  `cd commonbike-site`
  [`git flow init`](https://github.com/nvie/gitflow/wiki/Command-Line-Arguments#git-flow-init--fd)

## Running the app

1. `cd folderOfYourProject`
2. `meteor`
3. Go to localhost:3000 to see the app running

## Configuring login services like Facebook and Twitter

Configuring the login services is easy. Just go to [localhost:3000/commonbike-ui](/commonbike-ui). On this page you'll a bunch of UI components on one page. The first one, **Basic UI component**, shows a basic login/register module. Use this one to configure all the login services you prefer.

See [guide.meteor.com/accounts](https://guide.meteor.com/accounts.html#accounts-ui) for more information about this topic.

## Used libraries

- For mobile swiping: [react-swipe](https://github.com/voronianski/react-swipe)
- For UI elements: [material-ui](http://www.material-ui.com/)
- [meteor-simple-schema](https://github.com/aldeed/meteor-simple-schema) - A simple, reactive schema validation package for Meteor
- [react-contenteditable](https://github.com/lovasoa/react-contenteditable) - React component for a div with editable contents
- [draft.js](http://facebook.github.io/draft-js/) - Rich text editor framework for react
