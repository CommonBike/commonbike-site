import React from 'react';
import {mount} from 'react-mounter';

/**
 *  App
 */
import App from '/imports/components/App/App.jsx';

/**
 *  WelcomePage
 */
import WelcomePage from '/imports/components/WelcomePage/WelcomePage.jsx';

FlowRouter.route('/', {
  name: 'welcome',
  action() {
    mount(App, {
      content: (<WelcomePage />)
    });
  }
});

/**
 *  Login
 */
import SignUp from '/imports/components/SignUp/SignUp.jsx';

FlowRouter.route('/login', {
  name: 'login',
  action() {
    mount(App, {
      content: (<SignUp />)
    });
  }
});
