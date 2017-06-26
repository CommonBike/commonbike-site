/**
 *  App Routing
 */
import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom'
import Redirect from 'react-router/Redirect'

import Settings from '/imports/api/settings.js';
import BikeCoin from '/imports/api/bikecoin.js'

import UserApp from '/imports/client/components/UserApp/UserApp.jsx'
import Landing from '/imports/client/components/Landing/Landing.jsx'
import Join from '/imports/client/components/Join/Join.jsx'
import About from '/imports/client/components/About/About.jsx'
import ContentPage from '/imports/client/components/ContentPage/ContentPage.jsx'
import Login from '/imports/client/components/Login/Login.jsx'
import CustomPage from '/imports/client/components/CustomPage/CustomPage.jsx'
import Profile from '/imports/client/components/Profile/Profile.jsx'
import UserWallet from '/imports/client/containers/Wallet/UserWallet.jsx'
import LocationsOverview from '/imports/client/containers/LocationsOverview/LocationsOverview.jsx'
import LocationDetails from '/imports/client/containers/LocationDetails/LocationDetails.jsx'
import TransactionList from '/imports/client/containers/TransactionList/TransactionList.jsx'
import AdminUsersList from '/imports/client/containers/AdminUsersList/AdminUsersList.jsx'
import ObjectList from '/imports/client/containers/ObjectList/ObjectList.jsx'
import ObjectDetails from '/imports/client/containers/ObjectDetails/ObjectDetails.jsx'
import CommonBikeUI from '/imports/client/commonbike-ui.jsx'
import AdminTools from '/imports/client/components/AdminTools/AdminTools.jsx'
import LogList from '/imports/client/containers/LogList/LogList.jsx'
import PaymentOrder from '/imports/client/components/PaymentOrder/PaymentOrder.jsx'
import NoMatch from '/imports/client/components/NoMatch/NoMatch.jsx'

const UserAppLanding = () => (<UserApp showPageHeader={false} content={<Landing/>} background="#00d0a2"  />)
const UserAppAbout = () => (<UserApp content={<ContentPage><About /></ContentPage>} />)
const UserAppJoin = () => (<UserApp content={<ContentPage><Join /></ContentPage>} />)
const UserAppLogin = ({match}) => {
  // TEMPORARY because I can't find the way to get query params via react-router:
  var redirectTo = window.location.search.split('=')[1];
  return (<UserApp content={<CustomPage><Login redirectTo={redirectTo} /></CustomPage>} />)
}
const UserAppProfile = () => (<UserApp content={<div><Profile isEditable="true" /></div>} />)
const UserAppUserWallet = () => (<UserApp content={<div><UserWallet /></div>} />)

const UserAppLocationsOverview = () => (<UserApp showPageHeader={false} content={<LocationsOverview />} />)
const UserAppLocationDetails = ({match}) => {
  return (
    <UserApp content={<LocationDetails locationId={match.params.locationId} background="#fff"/>} />
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
    <UserApp content={<CustomPage backgroundColor="#fff"><ObjectDetails objectId={match.params.objectId}/></CustomPage>} />
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

const UserAppAdminLocationsOverview = () => (<UserApp content={<LocationsOverview isEditable="true" />} />)
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
      <Route path='/locations' component={UserAppLocationsOverview}/>
      <Route path='/map' component={UserAppLocationsMap}/>
      <Route path='/objects' component={UserAppObjectList}/>
      <Route path='/wallet' component={UserAppUserWallet}/>
      <Route path='/location/:locationId' component={UserAppLocationDetails}/>
      <Route path='/bike/details/:objectId' component={UserAppCustomPageObjectDetails}/>

      <RouteWhenLoggedIn path='/profile' component={UserAppProfile}/>
      <RouteWhenLoggedIn path='/transactions' component={UserAppTransactionList}/>
      <RouteWhenLoggedIn path='/bike/checkin/:objectId' component={UserAppCustomPageObjectDetailsCheckin}/>
      <RouteWhenLoggedIn path='/commonbike-ui' component={CommonBikeUI}/>

      <RouteWhenLoggedIn path='/payment/:internalPaymentId' component={PaymentOrder}/>

      <RouteWhenLoggedIn path='/admin/locations' component={UserAppAdminLocationsOverview}/>
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
  Meteor.subscribe('settings');

  // run once to get rid of the annoying service worker errors in the console
  // navigator.serviceWorker.getRegistrations().then(function(registrations) {
	//  for(let registration of registrations) {
	//    registration.unregister()
	// } })

  render(<App/>, document.getElementById('root'))
})
