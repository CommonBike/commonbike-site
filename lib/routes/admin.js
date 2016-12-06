import React from 'react';
import {mount} from 'react-mounter';

// Import components
import AdminApp from '/imports/components/AdminApp/AdminApp.jsx';
import PageHeader from '/imports/components/PageHeader/PageHeader.jsx';
import LocationList from '/imports/containers/AdminLocationList/AdminLocationList.jsx';
import LocationDetails from '/imports/components/LocationDetails/LocationDetails.jsx';

var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  fastRender: true
});

adminRoutes.route('/', {
  name: 'adminLocations',
  action() {
    mount(AdminApp, {
      content: (
        <div>
          <PageHeader />
          <LocationList />
        </div>
      )
    });
  }
});

adminRoutes.route('/:locationId', {
  name: 'adminLocation',
  action(params) {
    mount(AdminApp, {
      content: (
        <div>
          <PageHeader />
          <LocationDetails locationId={params.locationId} />
        </div>
      )
    });
  }
});
