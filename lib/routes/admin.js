import React from 'react';
import {mount} from 'react-mounter';

// Import components
import AdminApp from '/imports/components/AdminApp/AdminApp.jsx';
import LocationList from '/imports/components/LocationOverview/LocationOverview.jsx';

FlowRouter.route('/admin', {
  name: 'adminLocations',
  action() {
    mount(AdminApp, {
      content: (<LocationList />)
    });
  }
});
