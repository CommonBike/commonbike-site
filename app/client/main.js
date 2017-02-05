/**
 *  App Routing
 */
import React from 'react'
import {render} from 'react-dom'
import Router from 'react-router/BrowserRouter'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'
import Redirect from 'react-router/Redirect'

import Settings from '/imports/api/settings.js'; 

import UserApp from '/imports/client/components/UserApp/UserApp.jsx'
import Landing from '/imports/client/components/Landing/Landing.jsx'
import Join from '/imports/client/components/Join/Join.jsx'
import About from '/imports/client/components/About/About.jsx'
import ContentPage from '/imports/client/components/ContentPage/ContentPage.jsx'
import Login from '/imports/client/components/Login/Login.jsx'
import CustomPage from '/imports/client/components/CustomPage/CustomPage.jsx'
import Profile from '/imports/client/components/Profile/Profile.jsx'
import LocationList from '/imports/client/containers/LocationList/LocationList.jsx'
import LocationDetails from '/imports/client/containers/LocationDetails/LocationDetails.jsx'
import TransactionList from '/imports/client/containers/TransactionList/TransactionList.jsx'
import AdminUsersList from '/imports/client/containers/AdminUsersList/AdminUsersList.jsx'
import ObjectList from '/imports/client/containers/ObjectList/ObjectList.jsx'
import LocationsMap from '/imports/client/components/LocationsMap/LocationsMap.jsx'
import ObjectDetails from '/imports/client/containers/ObjectDetails/ObjectDetails.jsx'
import CommonBikeUI from '/imports/client/commonbike-ui.jsx'
import AdminTools from '/imports/client/components/AdminTools/AdminTools.jsx'
import NoMatch from '/imports/client/components/NoMatch/NoMatch.jsx'

const UserAppLanding = () => (<UserApp showPageHeader={false} content={<Landing/>} />)
const UserAppAbout = () => (<UserApp content={<ContentPage><About /></ContentPage>} />) 
const UserAppJoin = () => (<UserApp content={<ContentPage><Join /></ContentPage>} />) 
const UserAppLogin = () => (<UserApp content={<CustomPage><Login /></CustomPage>} />) // Login redirectTo={params.redirectTo}
const UserAppProfile = () => (<UserApp content={<div><Profile isEditable="true" /></div>} />)

const UserAppLocationList = () => (<UserApp content={<LocationList />} />)
const UserAppLocationDetails = ({params}) => {
  return (
    <UserApp content={<LocationDetails locationId={params.locationId} />} />
  )
}

const UserAppLocationsMap = () => (<UserApp content={<LocationsMap />} />)

const UserAppObjectList = () => (<UserApp content={<ObjectList showPrice={true} showState={true} />} />)

const UserAppTransactionList = () => (<UserApp content={<TransactionList />} />)

const AdminAppTransactionList = () => (<UserApp content={<TransactionList admin="true" />} />)

const UserAppRentalList = () => (<UserApp content={<ObjectList rentalsMode={true} showState={true} showRentalDetails={true} />} />)

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



const UserAppAdminAdminUsersList = () => (<UserApp content={<AdminUsersList />} />)
const UserAppAdminAdminTools = () => (<UserApp content={<AdminTools />} />)

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
      <Match pattern='/about' component={UserAppAbout}/>
      <Match pattern='/join' component={UserAppJoin}/>
      <Match pattern='/login' component={UserAppLogin}/> 
      
      <MatchWhenLoggedIn pattern='/profile' component={UserAppProfile}/> 
      <MatchWhenLoggedIn pattern='/locations' component={UserAppLocationList}/> 
      <MatchWhenLoggedIn pattern='/map' component={UserAppLocationsMap}/> 
      <MatchWhenLoggedIn pattern='/objects' component={UserAppObjectList}/> 
      <MatchWhenLoggedIn pattern='/transactions' component={UserAppTransactionList}/> 
      <MatchWhenLoggedIn pattern='/location/:locationId' component={UserAppLocationDetails}/> 
      <MatchWhenLoggedIn pattern='/bike/details/:objectId' component={UserAppCustomPageObjectDetails}/> 
      <MatchWhenLoggedIn pattern='/bike/checkin/:objectId' component={UserAppCustomPageObjectDetailsCheckin}/> 
      <MatchWhenLoggedIn pattern='/commonbike-ui' component={CommonBikeUI}/> 
      
      <MatchWhenLoggedIn pattern='/admin/locations' component={UserAppAdminLocationList}/> 
      <MatchWhenLoggedIn pattern='/admin/rentals' component={UserAppRentalList}/> 
      <MatchWhenLoggedIn pattern='/admin/location/:locationId' component={UserAppAdminLocationDetails}/> 
      <MatchWhenLoggedIn pattern='/admin/bike/details/:objectId' component={UserAppCustomAdminPageObjectDetails}/> 
      <MatchWhenLoggedIn pattern='/admin/users' component={UserAppAdminAdminUsersList}/> 
      <MatchWhenLoggedIn pattern='/admin/transactions' component={AdminAppTransactionList}/> 

      <MatchWhenLoggedIn pattern='/admin/AdminTools' component={UserAppAdminAdminTools}/> 

      <Miss component={NoMatch}/>
    </div>
  </Router>
)

Meteor.startup(() => {
  Meteor.subscribe("settings");
  
  render(<App/>, document.getElementById('root'))
})
