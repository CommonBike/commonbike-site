import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import R from 'ramda';
import { RedirectTo } from '/client/main'

// Import components
import EditFields from '../../components/EditFields/EditFields';

// Import models
import { Objects, ObjectsSchema } from '/imports/api/objects.js';
import { Locations } from '/imports/api/locations.js';

class EditObject extends Component {

  constructor(props) {
    super(props);
  }

  update(changes) {
    Meteor.call('objects.applychanges', this.props.object._id, changes);

    return true;
  }

  getLockFields() {
  	var fields = [];
    var lockType = this.props.object.lock.type;
	if(lockType=='open-keylocker') {
  		fields = [
	  		{
	          fieldname: 'lock.settings.keylocker',
	          fieldvalue: this.props.object.lock.settings.keylocker,
	          controltype: 'text',
	          label: 'Kluisje #'
	  		},
	  		{
	          fieldname: 'lock.settings.pincode',
	          fieldvalue: this.props.object.lock.settings.pincode,
	          controltype: 'text',
	          label: 'Pincode'
	  		}
	  	];
    } else if(lockType=='axa-elock') {
  		fields = [
	  		{
	          fieldname: 'lock.settings.connectionname',
	          fieldvalue: this.props.object.lock.settings.connectionname,
	          controltype: 'text',
	          label: 'Verbinding'
	  		},
	  		{
	          fieldname: 'lock.settings.pincode',
	          fieldvalue: this.props.object.lock.settings.pincode,
	          controltype: 'text',
	          label: 'Pincode'
	  		}
	  	]
    } else if(lockType=='skopei-v1') {
      fields = [
        {
            fieldname: 'lock.settings.elockid',
            fieldvalue: this.props.object.lock.settings.elockid,
            controltype: 'text',
            label: 'lock id'
        }
      ]
    } else if(lockType=='goabout-v1'||lockType=='open-elock') {
      fields = [
        {
            fieldname: 'lock.settings.elockid',
            fieldvalue: this.props.object.lock.settings.elockid,
            controltype: 'text',
            label: 'lock id'
        },
        {
            fieldname: 'lock.settings.code',
            fieldvalue: this.props.object.lock.settings.code,
            controltype: 'text',
            label: 'code'
        }
      ]
    } else if(lockType=='plainkey') {
  		fields = [
	  		{
	          fieldname: 'lock.settings.keyid',
	          fieldvalue: this.props.object.lock.settings.keyid,
	          controltype: 'text',
	          label: 'Sleutelnr.'
	  		}
	  	]
    } else if(lockType=='open-bikelocker') {
      fields = [
        {
            fieldname: 'lock.settings.callbackurl',
            fieldvalue: this.props.object.lock.settings.callbackurl,
            controltype: 'text',
            label: 'Callback URL'
        }
      ]
    } else {
    	// onbekend type slot
    }

    return fields;
  }

  getRentalFieldsSkopeiLock() {
    var fields = [];
    var lockType = this.props.object.lock.type;

    if(!this.props.object.state.rentalInfo||!this.props.object.state.rentalInfo.externalid) {
      fields = [
        {
            controltype: 'header',
            label: 'Verhuur (Skopei slot)'
        },
        {
            controltype: 'message',
            text: 'Niet verhuurd'
        },
      ]

      return fields;  // no reservation info
    }

    fields = [
      {
          controltype: 'header',
          label: 'Verhuur (Skopei slot)'
      },
      {
          fieldname: 'state.rentalInfo.externalid',
          fieldvalue: this.props.object.state.rentalInfo.externalid,
          controltype: 'text',
          label: 'External ID'
      },
      {
          fieldname: 'state.rentalInfo.datestart',
          fieldvalue: this.props.object.state.rentalInfo.datestart,
          controltype: 'text',
          label: 'Date Start'
      },
      {
          fieldname: 'state.rentalInfo.dateend',
          fieldvalue: this.props.object.state.rentalInfo.dateend,
          controltype: 'text',
          label: 'Date End'
      },
      {
          fieldname: 'state.rentalInfo.code',
          fieldvalue: this.props.object.state.rentalInfo.code,
          controltype: 'text',
          label: 'Code'
      },
      {
          fieldname: 'state.rentalInfo.pincode',
          fieldvalue: this.props.object.state.rentalInfo.pincode,
          controltype: 'text',
          label: 'Pincode'
      }
    ]

    return fields;
  }

  getRentalFieldsOpenBikeLocker() {
    var fields = [];

    if(!this.props.object.state.rentalInfo||!this.props.object.state.rentalInfo.pincode) {
      fields = [
        {
            controltype: 'header',
            label: 'Verhuur (Kluis)'
        },
        {
            controltype: 'message',
            text: 'Niet in gebruik'
        },
      ]

      return fields;  // no reservation info
    }

    fields = [
      {
          controltype: 'header',
          label: 'Verhuur (Kluis)'
      },
      {
          fieldname: 'state.rentalInfo.pincode',
          fieldvalue: this.props.object.state.rentalInfo.pincode,
          controltype: 'text',
          label: 'Pincode'
      },
      {
          fieldname: 'state.rentalInfo.cardhash',
          fieldvalue: this.props.object.state.rentalInfo.cardhash,
          controltype: 'text',
          label: 'Kaart code'
      }
    ]

    return fields;
  }

  getRentalFields() {
    var fields = [];
    var lockType = this.props.object.lock.type;
    if(lockType=='skopei-v1') { return this.getRentalFieldsSkopeiLock(); }
    else if (lockType=='open-bikelocker') { return this.getRentalFieldsOpenBikeLocker(); }
    else {
      // nog geen rental fields gedefinieerd
    }

    return fields;
  }

  getCoinFields() {
    fields = [
      {
          controltype: 'header',
          label: 'CommonBikeCoin'
      },
      {
          fieldname: 'object.wallet.address',
          fieldvalue: this.props.object.wallet.address,
          controltype: 'text',
          label: 'Address'
      },
      {
          fieldname: 'object.wallet.privatekey',
          fieldvalue: this.props.object.wallet.privatekey,
          controltype: 'text',
          label: 'Private Key'
      },
    ]

    return fields;
  }

  render() {
  	if(!this.props.object) {
    	return ( <div />);
  	}

  	var validLocations = Locations.find({},{fields:{_id:1, title:1}}).fetch();
  	var lockTypes = [ { _id: 'open-bikelocker', title: 'open-bikelocker'},
  	                  { _id: 'open-keylocker', title: 'open-keylocker'},
  	                  { _id: 'axa-elock', title: 'AXA e-lock'},
                      { _id: 'skopei-v1', title: 'Skopei e-lock'},
                      { _id: 'goabout-v1', title: 'GoAbout e-lock'},
                      { _id: 'open-elock', title: 'CommonBike e-lock'},
                    	{ _id: 'plainkey', title: 'sleutel'}];
  	var timeUnits = [ { _id: 'day', title: 'dag'},
  	                  { _id: 'halfday', title: 'dagdeel'},
  	                  { _id: 'hour', title: 'uur'}];

  	var fields = [
  		{
          controltype: 'header',
          label: 'Algemeen'
  		},
  		{
          fieldname: 'title',
          fieldvalue: this.props.object.title,
          controltype: 'text',
          label: 'Naam'
  		},
  		{
          fieldname: 'description',
          fieldvalue: this.props.object.description,
          controltype: 'text',
          label: 'Beschrijving'
  		},
  		{
          fieldname: 'imageUrl',
          fieldvalue: this.props.object.imageUrl,
          controltype: 'text',
          label: 'Avatar'
  		},
  		{
          fieldname: 'locationId',
          fieldvalue: this.props.object.locationId,
          controltype: 'combo',
          label: 'Locatie',
          options: validLocations
  		},
  		{
          controltype: 'header',
          label: 'Huurprijs'
  		},
  		{
          fieldname: 'price.value',
          fieldvalue: this.props.object.price.value,
          controltype: 'text',
          label: 'Bedrag'
  		},
  		{
          fieldname: 'price.currency',
          fieldvalue: this.props.object.price.currency,
          controltype: 'text',
          label: 'Munteenheid'
  		},
  		{
          fieldname: 'price.timeunit',
          fieldvalue: this.props.object.price.timeunit,
          controltype: 'combo',
          label: 'Tijdeenheid',
          options: timeUnits
  		},
  		{
          fieldname: 'price.description',
          fieldvalue: this.props.object.price.description,
          controltype: 'text',
          label: 'Beschrijving'
  		},
      {
          controltype: 'header',
          label: 'Status'
  		},
  		{
          fieldname: 'state.state',
          fieldvalue: this.props.object.state.state,
          controltype: 'text-readonly',
          label: 'State'
  		},
      {
          fieldname: 'state.userId',
          fieldvalue: this.props.object.state.userId,
          controltype: 'text-readonly',
          label: 'gebruikers ID'
  		},
      {
          fieldname: 'state.timestamp',
          fieldvalue: this.props.object.state.timestamp,
          controltype: 'text-readonly',
          label: 'timestamp'
  		},
      {
          fieldname: 'state.userDescription',
          fieldvalue: this.props.object.state.userDescription,
          controltype: 'text-readonly',
          label: 'beschrijving gebruiker'
  		},
  		{
          controltype: 'header',
          label: 'Slot'
  		},
  		{
          fieldname: 'lock.type',
          fieldvalue: this.props.object.lock.type,
          controltype: 'combo',
          label: 'Type Slot',
          options: lockTypes
  		}
  	]

  	fields = fields.concat(this.getLockFields());

    fields = fields.concat(this.getRentalFields());

    fields = fields.concat(this.getCoinFields());

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

EditObject.propTypes = {
  objectId: PropTypes.string.isRequired
};

EditObject.defaultProps = {
  objectId: ''
}

export default createContainer((props) => {
  // Subscribe to models
  Meteor.subscribe('objects');
  Meteor.subscribe('locations', true);

  // Return variables for use in this component
  return {
  	user: Meteor.user(),
    objectId: props.objectId,
    object: Objects.find({_id: props.objectId}).fetch()[0],
  };

}, EditObject);
