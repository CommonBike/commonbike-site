import React from 'react';
import {mount} from 'react-mounter';

// Import components
import UserApp from '/imports/components/UserApp/UserApp.jsx';
import LocationList from '/imports/components/LocationOverview/LocationOverview.jsx';

var chooseRoutes = FlowRouter.group({
  prefix: '/get',
  name: 'get',
  fastRender: true
});

chooseRoutes.route('/', {
  action(params) {
    mount(UserApp, {
      content: (<LocationList />)
    });
  },
});
