import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';

// Import components
import EditObject from '../../containers/EditObject/EditObject';
import RaisedButton from '../RaisedButton/RaisedButton.jsx'
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';
import Button from '../Button/Button';
import CheckInCode from '../CheckInCode/CheckInCode';
import MapSummary from '../../MapSummary';
import CheckInOutProcessPlainKey from '../CheckInOutProcess/CheckInOutProcessPlainKey';
import CheckInOutProcessAxaELock from '../CheckInOutProcess/CheckInOutProcessAxaELock';
import CheckInOutProcessOpenKeylocker from '../CheckInOutProcess/CheckInOutProcessOpenKeylocker';
import CheckInOutProcessOpenBikelocker from '../CheckInOutProcess/CheckInOutProcessOpenBikelocker';

class ObjectDetails extends Component {

  constructor(props) {
    super(props);
  }

  renderCheckInOutProcess() {
    if( ! this.props.object.lock ) return <div />;

    var lockType = this.props.object.lock.type;
    if(lockType=='open-bikelocker') {
      return (
        <CheckInOutProcessOpenBikelocker
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />
          );
    } else if(lockType=='open-keylocker') {
      return (
        <CheckInOutProcessOpenKeylocker 
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />
          );
    } else if(lockType=='axa-elock') {
      return (
        <CheckInOutProcessAxaELock 
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />
        );
    } else {
      return (
        <CheckInOutProcessPlainKey 
          object={this.props.object} isProvider={this.props.isEditable} locationId={this.props.location._id} />
        );
    }
  }

  render() {
    return (
      <div style={s.base}>

        <p style={s.intro}>
          <i><span dangerouslySetInnerHTML={{__html: this.props.location.title}} /></i>
        </p>

        <center>
          <MapSummary item={this.props.location} width={400} height={300}/>
        </center>

        <ObjectBlock
          item={this.props.object} />

        { this.props.isEditable? 
          <EditObject objectId={this.props.object._id} />
          :null }


        { this.renderCheckInOutProcess() }
        
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '20px 20px 0 20px',
    textAlign: 'center',
    minHeight: 'calc(100vh - 74px)',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  intro: {
    padding: '0px 5px 0px 70px',
    margin: '0 auto',
    maxWidth: '400px',
    textAlign: 'left',
    minHeight: '80px',
    fontSize: '1.2em',
    fontWeight: '500',
    maxWidth: '300px',
    background: 'url("/files/ObjectDetails/marker.svg") 0 0 / auto 60px no-repeat',
  },
}

ObjectDetails.contextTypes = {
  history: propTypes.historyContext
}

ObjectDetails.propTypes = {
  object: PropTypes.object,
  location: PropTypes.object,
  isEditable: PropTypes.any,
};

ObjectDetails.defaultProps = {
  object: {},
  location: {},
  isEditable: false
}

export default ObjectDetails;
