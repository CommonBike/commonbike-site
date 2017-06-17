import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { RedirectTo } from '/client/main'
import { StyleProvider } from '../../StyleProvider.js'

// Import components
import EditObject from '../../containers/EditObject/EditObject';
import RaisedButton from '../Button/RaisedButton.jsx'
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';
import Button from '../Button/Button';
import CheckInCode from '../CheckInCode/CheckInCode';
import MapSummary from '../../MapSummary';
import CheckInOutProcessPlainKey from '../CheckInOutProcess/CheckInOutProcessPlainKey';
import CheckInOutProcessAxaELock from '../CheckInOutProcess/CheckInOutProcessAxaELock';
import CheckInOutProcessOpenKeylocker from '../CheckInOutProcess/CheckInOutProcessOpenKeylocker';
import CheckInOutProcessOpenBikelocker from '../CheckInOutProcess/CheckInOutProcessOpenBikelocker';
import CheckInOutProcessOpenELock from '../CheckInOutProcess/CheckInOutProcessOpenELock';
import CheckInOutProcessSkopeiLock from '../CheckInOutProcess/CheckInOutProcessSkopeiLock';
import CheckInOutProcessGoAboutLock from '../CheckInOutProcess/CheckInOutProcessGoAboutLock';
import ManageApiKeys from '../ManageApiKeys/ManageApiKeys';
import Balance from '/imports/client/components/Balance/Balance.jsx';

class ObjectDetails extends Component {

  constructor(props) {
    super(props);
  }

  getBalance(item) {
    if(item&&item.wallet) {
       return (<Balance label="SALDO" address={item.wallet.address} providerurl="https://ropsten.infura.io/sCQUO1V3FOo" />);
    } else {
       console.log('no wallet!', item)
       return (<div />);
     }
  }

  renderCheckInOutProcess() {
    if( ! this.props.object.lock ) return <div />;

    var validUser = (Meteor.userId()==this.props.object.state.userId)||this.props.isEditable;

    if(this.props.object.state.state=="inuse"&&!validUser) {
      return (
        <div style={s.base}>
          <ul style={s.list}>
            <li style={s.listitem,s.mediumFont}>IN GEBRUIK</li>
          </ul>
        </div>
      );
    } else if(this.props.object.state.state!="available"&&!validUser) {
      return (
        <div style={s.base}>
          <ul style={s.list}>
            <li style={s.listitem,s.mediumFont}>NIET BESCHIKBAAR</li>
          </ul>
        </div>
      );
    }

    var lockType = this.props.object.lock.type;

    // If not logged in: refer to login page
    if( ! this.props.currentUser)
      return <Button onClick={RedirectTo.bind(this, '/login?redirectTo=/bike/details/'+this.props.object._id)}>Log in om te reserveren</Button>

    else if(lockType=='open-bikelocker')
      return <CheckInOutProcessOpenBikelocker
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />

    else if(lockType=='open-elock')
      return <CheckInOutProcessOpenELock
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />

    else if(lockType=='open-keylocker')
      return <CheckInOutProcessOpenKeylocker
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />

    else if(lockType=='axa-elock')
      return <CheckInOutProcessAxaELock
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />

    else if(lockType=='skopei-v1')
      return <CheckInOutProcessSkopeiLock
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />

    else if(lockType=='goabout-v1')
      return <CheckInOutProcessGoAboutLock
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />

    else
      return <CheckInOutProcessPlainKey
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />
  }

  render() {
    return (
      <div style={s.base}>

        <p style={s.intro}>
          Reserveer bij:<br /><span dangerouslySetInnerHTML={{__html: this.props.location.title}} />
        </p>

        <center>
          <MapSummary item={this.props.location} width={400} height={120}/>
        </center>

        <ObjectBlock
          item={this.props.object} />

        { this.props.isEditable?
          <EditObject objectId={this.props.object._id} />
          :null }

        { this.props.isEditable?
          <ManageApiKeys keyOwnerId={this.props.object._id} keyType="object" />
          :null }

{/*}        <div>{ this.getBalance( this.props.object ) }</div> */}

        { this.renderCheckInOutProcess() }

      </div>
    );
  }
}

var s = StyleProvider.getInstance().checkInOutProcess;

ObjectDetails.propTypes = {
  currentUser: PropTypes.object,
  isEditable: PropTypes.any,
  location: PropTypes.object,
  object: PropTypes.object,
};

ObjectDetails.defaultProps = {
  isEditable: false,
  location: {},
  object: {},
}

export default ObjectDetails
