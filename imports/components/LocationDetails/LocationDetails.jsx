import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js'; 
import { Objects } from '/imports/api/objects.js'; 
import Block from '../Block/Block';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx'

class LocationDetails extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={s.base}>
        <h1 style={s.title} dangerouslySetInnerHTML={{__html: 'Fietsen bij ' + (this.props.location ? this.props.location.title : '') }}></h1>
        {R.map((object) => <Block key={object._id} item={object} isEditable={this.props.isEditable} onClick={this.props.clickItemHandler} />, this.props.objects)}
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
  },
  title: {
    textAlign: 'center',
  }
}

LocationDetails.propTypes = {
  // children: PropTypes.any,
};

export default createContainer((props) => {
  return {
    location: Locations.find({_id: props.locationId}).fetch()[0],
    objects: Objects.find({}, {sort: {title: 1}}).fetch()
  };
}, LocationDetails);
