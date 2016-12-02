import React from 'react';
import {mount} from 'react-mounter';

/**
 *  App
 */
import UserApp from '/imports/components/App/App.jsx';
import AdminApp from '/imports/components/Admin/Admin.jsx';

/**
 *  Landing
 */
import Landing from '/imports/components/Landing/Landing.jsx';

FlowRouter.route('/', {
  name: 'landing',
  action() {
    mount(UserApp, {
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
      content: (<CustomPage><Login redirectTo={params.redirectTo} /></CustomPage>)
    });
  }
});

/**
 *  Admin
 */
import AdminLocations from '/imports/components/AdminLocations/AdminLocations.jsx';

FlowRouter.route('/admin', {
  name: 'adminLocations',
  action() {
    mount(AdminApp, {
      content: (<AdminLocations />)
    });
  }
});
