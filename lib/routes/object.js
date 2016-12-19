// import React from 'react';
// import {mount} from 'react-mounter';

// // Import components
// import UserApp from '/imports/components/UserApp/UserApp.jsx';
// import CustomPage from '/imports/components/CustomPage/CustomPage.jsx';
// import ObjectDetails from '/imports/containers/ObjectDetails/ObjectDetails.jsx';

// var objectRoutes = FlowRouter.group({
//   prefix: '/bike',
//   fastRender: true
// });

// // Object details page
// objectRoutes.route('/:objectId', {
//   name: 'object',
//   action(params) {
//     mount(UserApp, {
//       content: (
//         <CustomPage backgroundColor="#f9f9f9">
//           <ObjectDetails objectId={params.objectId} />
//         </CustomPage>
//       )
//     });
//   }
// });

// // Object checkin page
// objectRoutes.route('/:objectId/checkin', {
//   name: 'objectCheckIn',
//   action(params) {
//     mount(UserApp, {
//       content: (
//         <CustomPage backgroundColor="#f9f9f9">
//           <ObjectDetails objectId={params.objectId} checkedIn="true" />
//         </CustomPage>
//       )
//     });
//   }
// });
