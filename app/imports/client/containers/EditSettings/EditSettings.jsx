import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import R from 'ramda';
import {propTypes} from 'react-router';

// Import components
import EditFields from '../../components/EditFields/EditFields';

// Import models
import { Settings, SettingsSchema, defaultProfileName } from '/imports/api/settings.js'; 

class EditSettings extends Component {

  constructor(props) {
    super(props);
  }

  update(changes) {
    console.log('update settings ' + this.props.settings.profileName + ' with ', changes);

    var context =  SettingsSchema.newContext();
    if(!context.validate({ $set: changes}, {modifier: true} )) {
      alert('De wijzigingen bevatten ongeldige waarden');
      console.log(context);
      return false;
    };


    Meteor.call('settings.applychanges', this.props.settings._id, changes);

    return true;
  }

  render() {
  	if(!this.props.settings) {
    	return ( <div />);
  	}

    var yesNo = [ { _id: 'true', title: 'Yes'},
                  { _id: 'false', title: 'No'}];

  	var fields = [
      {
          controltype: 'header',
          label: 'Map'
      },
  		{
          fieldname: 'mapbox.style',
          fieldvalue: this.props.settings.mapbox.style,
          controltype: 'text',
          label: 'Style'
  		},
  		{
          fieldname: 'description',
          fieldvalue: this.props.settings.mapbox.userId,
          controltype: 'text',
          label: 'UserId',
  		},
      {
          controltype: 'header',
          label: 'Slack'
      },
  		{
          fieldname: 'slack.notify',
          fieldvalue: this.props.settings.slack.notify,
          controltype: 'combo',
          label: 'Notify',
          controltype: 'yesno'
  		},
  		{
          fieldname: 'slack.address',
          fieldvalue: this.props.settings.slack.address,
          controltype: 'text',
          label: 'Address'
  		},
      {
          fieldname: 'slack.channel',
          fieldvalue: this.props.settings.slack.channel,
          controltype: 'text',
          label: 'Channel'
      },
      {
          fieldname: 'slack.name',
          fieldvalue: this.props.settings.slack.name,
          controltype: 'text',
          label: 'Name'
      },
      {
          fieldname: 'slack.icon_emoji',
          fieldvalue: this.props.settings.slack.icon_emoji,
          controltype: 'text',
          label: 'Emoji'
      },
      {
          controltype: 'header',
          label: 'Veiligstallen'
      },
      {
          fieldname: 'veiligstallen.visible',
          fieldvalue: this.props.settings.veiligstallen.visible,
          label: 'Visible',
          controltype: 'yesno'
      },
      {
          fieldname: 'veiligstallen.kmlURL',
          fieldvalue: this.props.settings.veiligstallen.kmlURL,
          controltype: 'text',
          label: 'kmlURL'
      },
      {
          fieldname: 'veiligstallen.kmlLastDownloadTimestamp',
          fieldvalue: this.props.settings.veiligstallen.kmlLastDownloadTimestamp,
          controltype: 'number',
          label: 'timestamp of last download'
      },
  	]

    return (
      <EditFields title={this.props.title} fields={fields} apply={this.update.bind(this)} />
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

EditSettings.propTypes = {
  title: PropTypes.string.isRequired
};

EditSettings.defaultProps = {
  title: 'Instellingen'
}

export default createContainer((props) => {
  // Subscribe to models
  Meteor.subscribe('settings', true);

  var settings = Settings.find({profileName: defaultProfileName}).fetch()[0];
  if(!settings) {
    return {}
  }

  // Return variables for use in this component
  return {
    title: props.title,
    settings: settings // ,
  };

}, EditSettings);