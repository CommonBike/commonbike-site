/**
 *  App Routing
 */
import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
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
import LogList from '/imports/client/containers/LogList/LogList.jsx'
import NoMatch from '/imports/client/components/NoMatch/NoMatch.jsx'

const UserAppLanding = () => (<UserApp showPageHeader={false} content={<Landing/>} />)
const UserAppAbout = () => (<UserApp content={<ContentPage><About /></ContentPage>} />)
const UserAppJoin = () => (<UserApp content={<ContentPage><Join /></ContentPage>} />)
const UserAppLogin = () => (<UserApp content={<CustomPage><Login /></CustomPage>} />) // Login redirectTo={params.redirectTo}
const UserAppProfile = () => (<UserApp content={<div><Profile isEditable="true" /></div>} />)

const UserAppLocationList = () => (<UserApp showPageHeader={false} content={<div><LocationsMap /><LocationList /></div>} />)
const UserAppLocationDetails = ({match}) => {
  return (
    <UserApp content={<LocationDetails locationId={match.params.locationId} />} />
  )
}

const UserAppLocationsMap = () => (<UserApp content={<LocationsMap />} />)

const UserAppObjectList = () => (<UserApp content={<ObjectList showPrice={true} showState={true} />} />)

const UserAppTransactionList = () => (<UserApp content={<TransactionList />} />)

const AdminAppTransactionList = () => (<UserApp content={<TransactionList admin="true" />} />)

const AdminAppLogList = () => (<UserApp content={<LogList admin="true" />} />)

const UserAppRentalList = () => (<UserApp content={<ObjectList rentalsMode={true} showState={true} showRentalDetails={true} />} />)

const UserAppCustomPageObjectDetails = ({match}) => {
  return (
    <UserApp content={<CustomPage backgroundColor="#f9f9f9"><ObjectDetails objectId={match.params.objectId}/></CustomPage>} />
  )
}
const UserAppCustomAdminPageObjectDetails = ({match}) => {
  return (
    <UserApp content={<CustomPage backgroundColor="#f9f9f9"><ObjectDetails isEditable="true" objectId={match.params.objectId}/></CustomPage>} />
  )
}

const UserAppCustomPageObjectDetailsCheckin = ({match}) => {
  return (
    <UserApp content={<CustomPage backgroundColor="#f9f9f9"><ObjectDetails objectId={match.params.objectId} checkedIn={true}/></CustomPage>} />
  )
}

const UserAppAdminLocationList = () => (<UserApp content={<LocationList isEditable="true" />} />)
const UserAppAdminLocationDetails = ({match}) => {
  return (
    <UserApp content={<LocationDetails locationId={match.params.locationId} isEditable="true"/>} />
  )
}



const UserAppAdminAdminUsersList = () => (<UserApp content={<AdminUsersList />} />)
const UserAppAdminAdminTools = () => (<UserApp content={<AdminTools />} />)

// see: https://react-router.now.sh/auth-workflow
const RouteWhenLoggedIn = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
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
const RouteWhenAdmin = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
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
const EVENT_REDIRECTTO = 'EVENT_REDIRECTTO'

export const RedirectTo = (path) => {
  const event = new CustomEvent(EVENT_REDIRECTTO, {
    detail: {
      path: path
    }
  })
  window.dispatchEvent(event)
}

//
class AppRoutes extends React.Component {
  onRedirectToEventHandler(event) {
    this.props.history.push(event.detail.path)
  }

  componentDidMount() {
    window.addEventListener(EVENT_REDIRECTTO, this.onRedirectToEventHandler.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener(EVENT_REDIRECTTO, this.onRedirectToEventHandler.bind(this))
  }

  //
  render() {
    return (
     <Switch>
      <Route exact path='/' component={UserAppLanding}/>
      <Route path='/about' component={UserAppAbout}/>
      <Route path='/join' component={UserAppJoin}/>
      <Route path='/login' component={UserAppLogin}/>

      <RouteWhenLoggedIn path='/profile' component={UserAppProfile}/>
      <RouteWhenLoggedIn path='/locations' component={UserAppLocationList}/>
      <RouteWhenLoggedIn path='/map' component={UserAppLocationsMap}/>
      <RouteWhenLoggedIn path='/objects' component={UserAppObjectList}/>
      <RouteWhenLoggedIn path='/transactions' component={UserAppTransactionList}/>
      <RouteWhenLoggedIn path='/location/:locationId' component={UserAppLocationDetails}/>
      <RouteWhenLoggedIn path='/bike/details/:objectId' component={UserAppCustomPageObjectDetails}/>
      <RouteWhenLoggedIn path='/bike/checkin/:objectId' component={UserAppCustomPageObjectDetailsCheckin}/>
      <RouteWhenLoggedIn path='/commonbike-ui' component={CommonBikeUI}/>

      <RouteWhenLoggedIn path='/admin/locations' component={UserAppAdminLocationList}/>
      <RouteWhenLoggedIn path='/admin/rentals' component={UserAppRentalList}/>
      <RouteWhenLoggedIn path='/admin/location/:locationId' component={UserAppAdminLocationDetails}/>
      <RouteWhenLoggedIn path='/admin/bike/details/:objectId' component={UserAppCustomAdminPageObjectDetails}/>

      <RouteWhenAdmin path='/admin/users' component={UserAppAdminAdminUsersList}/>
      <RouteWhenAdmin path='/admin/admintools' component={UserAppAdminAdminTools}/>
      <RouteWhenAdmin path='/admin/transactions' component={AdminAppTransactionList}/>
      <RouteWhenLoggedIn path='/admin/log' component={AdminAppLogList}/>

      <Route component={NoMatch}/>
     </Switch>
  )}
}

const AppRoutesWithRouterContext = withRouter(AppRoutes)

//
class App extends React.Component {
  render() {
    return (
      <Router>
        <AppRoutesWithRouterContext/>
      </Router>
    )
  }
}

//
Meteor.startup(() => {
  Meteor.subscribe("settings");

  render(<App/>, document.getElementById('root'))
})
