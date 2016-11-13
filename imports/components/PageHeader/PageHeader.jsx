import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data';

// Necessary for material-ui
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import commonBikeTheme from '../../styles/baseThemes/commonBikeBaseTheme.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap for material-ui buttons
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Import templates
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

class PageHeader extends Component {

  constructor(props) {
    super(props);
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(commonBikeTheme) };
  }

  render() {
    return (
      <div style={s.base}>
        <AppBar
          title={<span style={{cursor: 'pointer'}}>CommonBike</span>}
          onTitleTouchTap={(e) => FlowRouter.go('welcome')}
          iconElementRight={this.props.currentUser ? <div>{this.props.currentUser.profile.name}<br />early adopter</div> : <FlatButton onClick={(e) => FlowRouter.go('login')} label="Login" />}
        />
      </div>
    );
  }

}

PageHeader.childContextTypes = {
  muiTheme: PropTypes.object.isRequired
}

var s = {
  base: {
    width: '100%',
  },
}

export default createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, PageHeader);
