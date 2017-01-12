/**
 *  App Routing
 */
import React from 'react'
import {render} from 'react-dom'
import Router from 'react-router/BrowserRouter'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'
import Redirect from 'react-router/Redirect'

import UserApp from '/imports/client/components/UserApp/UserApp.jsx'
import Landing from '/imports/client/components/Landing/Landing.jsx'
import Join from '/imports/client/components/Join/Join.jsx'
import ContentPage from '/imports/client/components/ContentPage/ContentPage.jsx'
import Login from '/imports/client/components/Login/Login.jsx'
import CustomPage from '/imports/client/components/CustomPage/CustomPage.jsx'
import Profile from '/imports/client/components/Profile/Profile.jsx'
import LocationList from '/imports/client/containers/LocationList/LocationList.jsx'
import LocationDetails from '/imports/client/containers/LocationDetails/LocationDetails.jsx'
import ObjectList from '/imports/client/containers/ObjectList/ObjectList.jsx'
import ObjectDetails from '/imports/client/containers/ObjectDetails/ObjectDetails.jsx'
import CommonBikeUI from '/imports/client/commonbike-ui.jsx'
import NoMatch from '/imports/client/components/NoMatch/NoMatch.jsx'

const UserAppLanding = () => (<UserApp showPageHeader={false} content={<Landing/>} />)
const UserAppJoin = () => (<UserApp content={<ContentPage><Join /></ContentPage>} />) 
const UserAppLogin = () => (<UserApp content={<CustomPage><Login /></CustomPage>} />) // Login redirectTo={params.redirectTo}
const UserAppProfile = () => (<UserApp content={<div><Profile isEditable="true" /></div>} />)

const UserAppLocationList = () => (<UserApp content={<LocationList />} />)
const UserAppLocationDetails = ({params}) => {
  return (
    <UserApp content={<LocationDetails locationId={params.locationId}/>} />
  )
}

const UserAppObjectList = () => (<UserApp content={<ObjectList />} />)

const UserAppRentalList = () => (<UserApp content={<ObjectList isEditable="true"/>} />)

const UserAppCustomPageObjectDetails = ({params}) => {
  return (
    <UserApp content={<CustomPage backgroundColor="#f9f9f9"><ObjectDetails objectId={params.objectId}/></CustomPage>} />
  )
}
const UserAppCustomAdminPageObjectDetails = ({params}) => {
  return (
    <UserApp content={<CustomPage backgroundColor="#f9f9f9"><ObjectDetails isEditable="true" objectId={params.objectId}/></CustomPage>} />
  )
}

const UserAppCustomPageObjectDetailsCheckin = ({params}) => {
  return (
    <UserApp content={<CustomPage backgroundColor="#f9f9f9"><ObjectDetails objectId={params.objectId} checkedIn={true}/></CustomPage>} />
  )
}

const UserAppAdminLocationList = () => (<UserApp content={<LocationList isEditable="true" />} />)
const UserAppAdminLocationDetails = ({params}) => {
  return (
    <UserApp content={<LocationDetails locationId={params.locationId} isEditable="true"/>} />
  )
}

// see: https://react-router.now.sh/auth-workflow
const MatchWhenLoggedIn = ({ component: Component, ...rest }) => (
  <Match {...rest} render={props => (
    Meteor.userId() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

// see: https://react-router.now.sh/auth-workflow
const MatchWhenAdmin = ({ component: Component, ...rest }) => (
  <Match {...rest} render={props => (
    Roles.userIsInRole(Meteor.userId(), 'admin') ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

//
const App = () => (
  <Router>
    <div>
      <Match exactly pattern='/' component={UserAppLanding}/>
      <Match pattern='/join' component={UserAppJoin}/>
      <Match pattern='/login' component={UserAppLogin}/> 
      
      <MatchWhenLoggedIn pattern='/profile' component={UserAppProfile}/> 
      <MatchWhenLoggedIn pattern='/locations' component={UserAppLocationList}/> 
      <MatchWhenLoggedIn pattern='/objects' component={UserAppObjectList}/> 
      <MatchWhenLoggedIn pattern='/location/:locationId' component={UserAppLocationDetails}/> 
      <MatchWhenLoggedIn pattern='/bike/details/:objectId' component={UserAppCustomPageObjectDetails}/> 
      <MatchWhenLoggedIn pattern='/bike/checkin/:objectId' component={UserAppCustomPageObjectDetailsCheckin}/> 
      <MatchWhenLoggedIn pattern='/commonbike-ui' component={CommonBikeUI}/> 
      
      <MatchWhenLoggedIn pattern='/admin/locations' component={UserAppAdminLocationList}/> 
      <MatchWhenLoggedIn pattern='/admin/rentals' component={UserAppRentalList}/> 
      <MatchWhenLoggedIn pattern='/admin/location/:locationId' component={UserAppAdminLocationDetails}/> 
      <MatchWhenLoggedIn pattern='/admin/bike/details/:objectId' component={UserAppCustomAdminPageObjectDetails}/> 

      <Miss component={NoMatch}/>
    </div>
  </Router>
)

Meteor.startup(() => {
  render(<App/>, document.getElementById('root'))
})
