import React from 'react';
import {mount} from 'react-mounter';

/**
 *  Main components
 */
import UserApp from '/imports/components/UserApp/UserApp.jsx';
import CommonBikeUI from '/imports/commonbike-ui.jsx';

/**
 *  Components
 */
//..

/**
 *  CommonBikeUI
 */

FlowRouter.route('/commonbike-ui', {
  name: 'commonbike-ui',
  action() {
    mount(UserApp, {
      content: (<CommonBikeUI />)
    });
  }
});

/**
 *  Landing
 */
import Landing from '/imports/components/Landing/Landing.jsx';

FlowRouter.route('/', {
  name: 'landing',
  action() {
    mount(UserApp, {
      background: '#00d0a2',
      showPageHeader: false,
      content: (<Landing />)
    });
  }
});

/**
 *  About
 */
import ContentPage from '/imports/components/ContentPage/ContentPage.jsx';
import Join from '/imports/components/Join/Join.jsx';

FlowRouter.route('/join', {
  name: 'join',
  action() {
    mount(UserApp, {
      content: (<ContentPage><Join /></ContentPage>)
    });
  }
});

/**
 *  Login
 */
import Login from '/imports/components/Login/Login.jsx';
import CustomPage from '/imports/components/CustomPage/CustomPage.jsx';

FlowRouter.route('/login', {
  name: 'login',
  action(params) {
    mount(UserApp, {
      pageHeader: false,
      content: (<CustomPage><Login redirectTo={params.redirectTo} /></CustomPage>)
    });
  }
});
