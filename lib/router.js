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
  action() {
    mount(App, {
      content: (<WelcomePage />)
    });
  }
});

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

import CheckIn from '/imports/components/CheckIn/CheckIn.jsx';

FlowRouter.route('/checkin/:lockTitle', {

  action: function(params) {
    mount(App, {
      content: (<CheckIn lockTitle={params.lockTitle} />)
    });
  }
});
