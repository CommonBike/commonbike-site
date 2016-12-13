import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx'
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';
import Button from '../Button/Button';
import CheckInCode from '../CheckInCode/CheckInCode';

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

        <p style={s.intro}>
          Reserveer bij <i><span dangerouslySetInnerHTML={{__html: this.props.location.title}} /></i>
        </p>

        <ObjectBlock
          item={this.props.object} />

        {this.props.checkedIn
          ? <CheckInCode />
          : <Button onClick={() => FlowRouter.go('objectCheckIn', {objectId: this.props.object._id })} buttonStyle="huge">Reserveer!</Button>}

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
    paddingLeft: '70px',
    textAlign: 'left',
    minHeight: '80px',
    fontSize: '1.2em',
    fontWeight: '500',
    maxWidth: '300px',
    background: 'url("/files/ObjectDetails/marker.svg") 0 0 / auto 60px no-repeat',
  },
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
