/**
 *  App Routing
 */
import React from 'react'
import {render} from 'react-dom'
import Router from 'react-router/BrowserRouter'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'

import UserApp from '/imports/components/UserApp/UserApp.jsx'
import Landing from '/imports/components/Landing/Landing.jsx'
import Join from '/imports/components/Join/Join.jsx'
import Map from '/imports/client/Map.jsx'
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

const App = () => (
  <Router>
    <div>
      <Match exactly pattern='/' component={UserAppLanding}/>
      <Match pattern='/join' component={UserAppJoin}/>
      <Match pattern='/login' component={UserAppLogin}/> 
      <Match pattern='/map' component={Map}/> 
      
      {/* XXX these routes should only be visible when logged in */}
      <Match pattern='/profile' component={UserAppProfile}/> 
      <Match pattern='/locations' component={UserAppLocationList}/> 
      <Match pattern='/location/:locationId' component={UserAppLocationDetails}/> 
      <Match pattern='/bike/details/:objectId' component={UserAppCustomPageObjectDetails}/> 
      <Match pattern='/bike/checkin/:objectId' component={UserAppCustomPageObjectDetailsCheckin}/> 
      <Match pattern='/commonbike-ui' component={CommonBikeUI}/> 
      
      {/* XXX these routes should only be visible with the correct (admin?) Role */}
      <Match pattern='/admin/locations' component={UserAppAdminLocationList}/> 
      <Match pattern='/admin/location/:locationId' component={UserAppAdminLocationDetails}/> 

      {/* emergency exit */}
      <Miss component={NoMatch}/>
    </div>
  </Router>
)

Meteor.startup(() => {
  render(<App/>, document.getElementById('root'))
})
