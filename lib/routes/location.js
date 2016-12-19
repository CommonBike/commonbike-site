// import React from 'react';
// import {mount} from 'react-mounter';

// // Import components
// import UserApp from '/imports/components/UserApp/UserApp.jsx';
// import LocationList from '/imports/containers/LocationList/LocationList.jsx';
// import LocationDetails from '/imports/containers/LocationDetails/LocationDetails.jsx';

// var locationRoutes = FlowRouter.group({
//   prefix: '/location',
//   fastRender: true
// });

// // Location overview page
// locationRoutes.route('/', {
//   name: 'locations',
//   action(params) {
//     mount(UserApp, {
//       content: (
//         <LocationList />
//       )
//     });
//   },
// });

// // Location details page
// locationRoutes.route('/:locationId', {
//   name: 'location',
//   action(params) {
//     mount(UserApp, {
//       content: (
//         <LocationDetails locationId={params.locationId} />
//       )
//     });
//   }
// });