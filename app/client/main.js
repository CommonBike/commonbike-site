/**
 *  App Routing
 */
import React from 'react'
import {render} from 'react-dom'
import Router from 'react-router/BrowserRouter'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'
import Redirect from 'react-router/Redirect'

import UserApp from '/imports/components/UserApp/UserApp.jsx'
import Landing from '/imports/components/Landing/Landing.jsx'
import Join from '/imports/components/Join/Join.jsx'
import ContentPage from '/imports/components/ContentPage/ContentPage.jsx'
import Login from '/imports/components/Login/Login.jsx'
import CustomPage from '/imports/components/CustomPage/CustomPage.jsx'
import Profile from '/imports/components/Profile/Profile.jsx'
import LocationList from '/imports/containers/LocationList/LocationList.jsx'
import LocationDetails from '/imports/containers/LocationDetails/LocationDetails.jsx'
import ObjectDetails from '/imports/containers/ObjectDetails/ObjectDetails.jsx'
import CommonBikeUI from '/imports/commonbike-ui.jsx'
import NoMatch from '/imports/components/NoMatch/NoMatch.jsx'

Meteor.subscribe('locations')

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

const UserAppCustomPageObjectDetails = ({params}) => {
  return (
    <UserApp content={<CustomPage backgroundColor="#f9f9f9"><ObjectDetails objectId={params.objectId}/></CustomPage>} />
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
      <MatchWhenLoggedIn pattern='/location/:locationId' component={UserAppLocationDetails}/> 
      <MatchWhenLoggedIn pattern='/bike/details/:objectId' component={UserAppCustomPageObjectDetails}/> 
      <MatchWhenLoggedIn pattern='/bike/checkin/:objectId' component={UserAppCustomPageObjectDetailsCheckin}/> 
      <MatchWhenLoggedIn pattern='/commonbike-ui' component={CommonBikeUI}/> 
      
      <MatchWhenAdmin pattern='/admin/locations' component={UserAppAdminLocationList}/> 
      <MatchWhenAdmin pattern='/admin/location/:locationId' component={UserAppAdminLocationDetails}/> 

      <Miss component={NoMatch}/>
    </div>
  </Router>
)

Meteor.startup(() => {
  render(<App/>, document.getElementById('root'))
})
