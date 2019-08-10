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
          label: 'Server'
      },
      {
          fieldname: 'baseurl',
          fieldvalue: this.props.settings.baseurl,
          controltype: 'text',
          label: 'Base URL (server url)'
  		},
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
          fieldname: 'mapbox.userId',
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
      {
          controltype: 'header',
          label: 'Automatic Onboarding'
      },
  		{
          fieldname: 'onboarding.enabled',
          fieldvalue: this.props.settings.onboarding.enabled,
          controltype: 'combo',
          label: 'Enabled',
          controltype: 'yesno'
  		},
      {
          controltype: 'header',
          label: 'MongoDB Backup'
      },
      {
          fieldname: 'backup.location',
          fieldvalue: this.props.settings.backup.location,
          controltype: 'text',
          label: 'storage directory'
      },
      {
          controltype: 'header',
          label: 'Skopei Integration'
      },
      {
          fieldname: 'skopei.enabled',
          fieldvalue: this.props.settings.skopei.enabled,
          label: 'Enabled',
          controltype: 'yesno'
      },
      {
          fieldname: 'skopei.clientid',
          fieldvalue: this.props.settings.skopei.clientid,
          controltype: 'text',
          label: 'Client ID'
      },
      {
          fieldname: 'skopei.clientkey',
          fieldvalue: this.props.settings.skopei.clientkey,
          controltype: 'text',
          label: 'Client Key'
      },
      {
          controltype: 'header',
          label: 'GoAbout Integration'
      },
      {
          fieldname: 'goabout.enabled',
          fieldvalue: this.props.settings.goabout.enabled,
          label: 'Enabled',
          controltype: 'yesno'
      },
      {
          fieldname: 'goabout.clientid',
          fieldvalue: this.props.settings.goabout.clientid,
          controltype: 'text',
          label: 'Client ID'
      },
      {
          fieldname: 'goabout.clientsecret',
          fieldvalue: this.props.settings.goabout.clientsecret,
          controltype: 'text',
          label: 'Client Secret'
      },
      {
          fieldname: 'goabout.userbearertoken',
          fieldvalue: this.props.settings.goabout.userbearertoken,
          controltype: 'text',
          label: 'User Bearer Token'
      },
      {
          controltype: 'header',
          label: 'Use GPS Location'
      },
      {
          fieldname: 'gps.enabled',
          fieldvalue: this.props.settings.gps.enabled,
          label: 'Enabled',
          controltype: 'yesno'
      },
      {
          controltype: 'header',
          label: 'BikeCoin Contract'
      },
  		{
          fieldname: 'bikecoin.enabled',
          fieldvalue: this.props.settings.bikecoin.enabled,
          controltype: 'combo',
          label: 'Enabled',
          controltype: 'yesno'
  		},
      {
          fieldname: 'bikecoin.provider_url',
          fieldvalue: this.props.settings.bikecoin.provider_url,
          controltype: 'text',
          label: 'Provider URL'
      },
      {
          fieldname: 'bikecoin.deploycontract',
          fieldvalue: 'bikecoin.deploycontract',
          controltype: 'serverside-action',
          label: 'Deploy Contract'
      },
      {
          fieldname: 'bikecoin.token_address',
          fieldvalue: this.props.settings.bikecoin.token_address,
          controltype: 'text',
          label: 'Token Address'
      },
      {
          fieldname: 'bikecoin.token_abi',
          fieldvalue: this.props.settings.bikecoin.token_abi,
          controltype: 'text',
          label: 'Token ABI'
      },
      {
          controltype: 'header',
          label: 'Application BikeCoin Wallet'
      },
      {
          fieldname: 'bikecoin.coin.wallet.address',
          fieldvalue: this.props.settings.bikecoin.wallet.address,
          controltype: 'text',
          label: 'Address'
      },
      {
          fieldname: 'bikecoin.coin.wallet.privatekey',
          fieldvalue: this.props.settings.bikecoin.wallet.privatekey,
          controltype: 'text',
          label: 'Private Key'
      },
      {
          controltype: 'header',
          label: ''
      },
  	]

    var handlers = [
      { name: "deploycontract",
        action: this.deployContract
      }
    ]

    return (
      <EditFields title={this.props.title} fields={fields} handlers={handlers} apply={this.update.bind(this)} />
    );
  }

  deployContract() {
    console.log("deploy the contracts now!!!!!!")
    // Meteor.call('bikecoin.deploycontract');
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
  title: 'INSTELLINGEN'
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
