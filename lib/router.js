<<<<<<< HEAD
=======
import React from 'react'
import Router from 'react-router/BrowserRouter'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'
// import Link from 'react-router/Link'

import UserApp from '/imports/components/UserApp/UserApp.jsx'
import Landing from '/imports/components/Landing/Landing.jsx'
import CommonBikeUI from '/imports/commonbike-ui.jsx'
import ContentPage from '/imports/components/ContentPage/ContentPage.jsx'
import Join from '/imports/components/Join/Join.jsx'
import NoMatch from '/imports/components/NoMatch/NoMatch.jsx'

const App = () => (
  <Router>
    <Match exactly pattern='/' component={Landing}/>
    <Match pattern='/commonbike-ui' component={About}/> {/* <Match pattern='/join' component={<ContentPage><Join /></ContentPage>} /> */}
    <Miss component={NoMatch}/>
  </Router>
)

export default App


>>>>>>> define some basic routes
// import React from 'react';
// import {mount} from 'react-mounter';

// /**
//  *  Main components
//  */
// import UserApp from '/imports/components/UserApp/UserApp.jsx';
// import CommonBikeUI from '/imports/commonbike-ui.jsx';

// /**
//  *  Components
//  */
// //..

// /**
//  *  CommonBikeUI
//  */

// FlowRouter.route('/commonbike-ui', {
//   name: 'commonbike-ui',
//   action() {
//     mount(UserApp, {
//       content: (<CommonBikeUI />)
//     });
//   }
// });

// /**
//  *  Landing
//  */
// import Landing from '/imports/components/Landing/Landing.jsx';

// FlowRouter.route('/', {
//   name: 'landing',
//   action() {
//     mount(UserApp, {
//       background: '#00d0a2',
//       showPageHeader: false,
//       content: (<Landing />)
//     });
//   }
// });

// /**
//  *  About
//  */
// import ContentPage from '/imports/components/ContentPage/ContentPage.jsx';
// import Join from '/imports/components/Join/Join.jsx';

// FlowRouter.route('/join', {
//   name: 'join',
//   action() {
//     mount(UserApp, {
//       content: (<ContentPage><Join /></ContentPage>)
//     });
//   }
// });
