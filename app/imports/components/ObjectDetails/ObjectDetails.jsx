import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx'
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';
import Button from '../Button/Button';
import CheckInCode from '../CheckInCode/CheckInCode';
// import Map from '../../client/Map'

class ObjectDetails extends Component {

  constructor(props) {
    super(props);
  }

  newObject() {
    this.props.newObject(this.props.locationId);
  }

  render() {
    return (
      <div style={s.base}>

        {/* <Map address={this.props.location.address}/> */}

        <p style={s.intro}>
          Reserveer bij <i><span dangerouslySetInnerHTML={{__html: this.props.location.title}} /></i>
        </p>
        
        <ObjectBlock
          item={this.props.object} />

        {this.props.checkedIn
          ? <CheckInCode />
          : <Button onClick={() => this.context.history.push('/bike/checkin/' + this.props.object._id )} buttonStyle="huge">Reserveer!</Button>}

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
    minHeight: 'calc(100vh - 66px)',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  intro: {
    padding: '0 70px',
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
  checkedIn: PropTypes.any,
};

ObjectDetails.defaultProps = {
  object: {},
  location: {},
  checkedIn: false
}

export default ObjectDetails;
