import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx'
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';
import Button from '../Button/Button';
import CheckInCode from '../CheckInCode/CheckInCode';
import Map from '../../Map'

class ObjectDetails extends Component {

  constructor(props) {
    super(props);
  }

  setObjectReserved() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'reserved');
  }

  setObjectInUse() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'inuse');
  }

  setObjectAvailable() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'available');
  }

  setObjectOutOfOrder() {
    Meteor.call('objects.setState', this.props.object._id, Meteor.userId(), 'outoforder');
  }

  renderButtons() {
    if (this.props.isEditable) {
        return this.renderButtonsForAdmin();
    } else {
        return this.renderButtonsForUser();      
    }
  }

  renderButtonsForAdmin() {
      if(this.props.object.state.state=='reserved') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Annuleer reservering!</Button>);
      } else if(this.props.object.state.state=='inuse') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Annuleer verhuur!</Button>);
      } else if(this.props.object.state.state=='outoforder') {
        return (<Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Maak beschikbaar!</Button>);
      } 

      return (<Button onClick={() => this.setObjectOutOfOrder() } buttonStyle="huge">Maak niet beschikbaar!</Button>);
  }

  renderButtonsForUser() {
        return (
          <div>
          {this.props.object.state.state=='available' ?
            <Button onClick={() => this.setObjectReserved() } buttonStyle="huge">Reserveer!</Button> : <div /> }
          {this.props.object.state.state=='reserved' ? 
            <article>
              <Button onClick={() => this.setObjectInUse() } buttonStyle="huge">Neem mee!</Button>
              <CheckInCode />
              <Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Toch maar niet!</Button>
            </article>
            : <div /> }
          {this.props.object.state.state=='inuse' ? 
            <article>
              <CheckInCode code="C28" title="Retourcode" />
              <Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Breng terug!</Button> 
            </article>
            : <div /> }
          {this.props.object.state.state=='outoforder' ? 
              <Button onClick={() => this.setObjectAvailable() } buttonStyle="huge">Maak beschikbaar!</Button> 
            : <div /> }
          </div>
        );
  }

  render() {
    return (
      <div style={s.base}>

        <p style={s.intro}>
          Reserveer bij <i><span dangerouslySetInnerHTML={{__html: this.props.location.title}} /></i>
        </p>

        <center>
          <Map item={this.props.location} width={400} height={300}/>
        </center>

        <ObjectBlock
          item={this.props.object} />

        { this.renderButtons() }
        
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
  isEditable: PropTypes.any,
};

ObjectDetails.defaultProps = {
  object: {},
  location: {},
  isEditable: false
}

export default ObjectDetails;
