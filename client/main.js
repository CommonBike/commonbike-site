import React from 'react'
import {render} from 'react-dom'
import Router from 'react-router/BrowserRouter'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'

import UserApp from '/imports/components/UserApp/UserApp.jsx'
import Landing from '/imports/components/Landing/Landing.jsx'
import CommonBikeUI from '/imports/commonbike-ui.jsx'
import ContentPage from '/imports/components/ContentPage/ContentPage.jsx'
import Join from '/imports/components/Join/Join.jsx'
import NoMatch from '/imports/components/NoMatch/NoMatch.jsx'

Meteor.subscribe('locations')

const App = () => (
  <Router>
    <div>
      <Match exactly pattern='/' component={Landing}/>
      <Match pattern='/commonbike-ui' component={CommonBikeUI}/>
      {/* <Match pattern='/join' component={<ContentPage><Join /></ContentPage>} /> */}
      <Miss component={NoMatch}/>
    </div>
  </Router>
)

Meteor.startup(() => {
  render(<App/>, document.getElementById('root'))
})
