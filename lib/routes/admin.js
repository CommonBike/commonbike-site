// import React from 'react';
// import {mount} from 'react-mounter';

// // Import components
// import AdminApp from '/imports/components/AdminApp/AdminApp.jsx';
// import PageHeader from '/imports/components/PageHeader/PageHeader.jsx';
// import LocationList from '/imports/containers/LocationList/LocationList.jsx';
// import LocationDetails from '/imports/containers/LocationDetails/LocationDetails.jsx';

// var adminRoutes = FlowRouter.group({
//   prefix: '/admin',
//   fastRender: true,
//   triggersEnter: [
//         (context, redirect) => {
//             if( !Meteor.userId() ) {
//               FlowRouter.go('login');
//             } else {

//             }
//         }
//     ]  
// });

// // Location details admin page
// adminRoutes.route('/location/:locationId', {
//   name: 'adminLocation',
//   action(params) {
//     mount(AdminApp, {
//       content: (
//         <div>
//           <PageHeader />
//           <LocationDetails locationId={params.locationId} isEditable="true" />
//         </div>
//       )
//     });
//   }
// });

// // Location overview admin page
// adminRoutes.route('/', {
//   name: 'admin',
//   action() {
//     FlowRouter.go('adminLocations');
//   }
// });
