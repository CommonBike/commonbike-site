import React from 'react';
import {mount} from 'react-mounter';

/**
 *  App
 */
import App from '/imports/components/App/App.jsx';

/**
 *  Landing
 */
import Landing from '/imports/components/Landing/Landing.jsx';

FlowRouter.route('/', {
  action() {
    mount(App, {
      content: (<Landing />)
    });
  }
});
