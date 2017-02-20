import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import R from 'ramda';

// Import components
import EditFields from '../../components/EditFields/EditFields';

// Import models
import { Locations, LocationsSchema, Address2LatLng } from '/imports/api/locations.js'; 

class EditLocation extends Component {

  constructor(props) {
    super(props);
  }

  update(changes) {
    if(changes.hasOwnProperty('lat_lng')) {
      if(changes.lat_lng!="") {
        changes.lat_lng = changes.lat_lng.split(",").map(Number);
      } else {
        changes.lat_lng = [];
      }
    }

    var context =  LocationsSchema.newContext();
    if(!context.validate({ $set: changes}, {modifier: true} )) {
      alert('De wijzigingen bevatten ongeldige waarden');
      console.log(context);
      return false;
    };

    console.log('update location ' + this.props.location.title + ' with ', changes);

    Meteor.call('locations.applychanges', this.props.location._id, changes);

    return true;
  }

  getLatLongString(lat_lng) {
    var lat_lng_str = "";

    if(lat_lng) {
      lat_lng_str = lat_lng.toString();
      if(lat_lng_str=="0,0") {
        lat_lng_str="";
      }
    }  

    return lat_lng_str;
  }

  render() {
  	if(!this.props.location) {
    	return ( <div />);
  	}

  	var fields = [
  		{
          fieldname: 'title',
          fieldvalue: this.props.location.title,
          controltype: 'text',
          label: 'Titel'
  		},
  		{
          fieldname: 'description',
          fieldvalue: this.props.location.description,
          controltype: 'text',
          label: 'Beschrijving'
  		},
  		{
          fieldname: 'address',
          fieldvalue: this.props.location.address,
          controltype: 'text',
          label: 'Adres'
  		},
  		{
          fieldname: 'lat_lng',
          fieldvalue: this.getLatLongString(this.props.location.lat_lng), // convert to comma separated string
          controltype: 'text',
          label: 'GPS Locatie'
  		},
  		{
          fieldname: 'imageUrl',
          fieldvalue: this.props.location.imageUrl,
          controltype: 'text',
          label: 'Avatar'
  		}
  	]

    return (
      <EditFields fields={fields} apply={this.update.bind(this)} />
    );
  }

}

var s = {
  base: {
    background: '#fff',
    display: 'flex',
    fontWeight: 'normal',
    lineHeight: 'normal',
    padding: '10px',
    maxWidth: '100%',
    width: '400px',
    margin: '20px auto',
    borderBottom: 'solid 5px #bc8311',
    textAlign: 'left',
  },
}

EditLocation.propTypes = {
  locationId: PropTypes.string.isRequired
};

EditLocation.defaultProps = {
  locationId: ''
}

export default createContainer((props) => {
  // Subscribe to models
  Meteor.subscribe('locations', true);

  // Return variables for use in this component
  return {
    locationId: props.locationId,
    location: Locations.find({_id: props.locationId}).fetch()[0],
  };

}, EditLocation);
