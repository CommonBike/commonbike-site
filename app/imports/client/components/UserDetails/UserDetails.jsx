import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { RedirectTo } from '/client/main'

// Import components
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';

class UserDetails extends Component {

  constructor(props) {
    super(props);

    this.state = { showDetails: false }
  }

  componentDidMount() {
    // Hack around a bug in Radium:
    ReactDOM.findDOMNode(this.refs.base).style.display = 'flex';
    ReactDOM.findDOMNode(this.refs.textWrapper).style.display = 'flex';
  }

  getToggleButton(servermethod, userId, isOn, readonly, warning='' ) {
    var imagesrc = (isOn ? s.images.yes : s.images.no);

    if(!readonly) {
      return(
        <img src={imagesrc} style={s.icon} alt="toggle" onClick={() => {
          if(warning && !isOn && ! confirm('Weet je zeker dat je deze gebruiker admin rechten wilt geven?')) {
            return;
          }

          Meteor.call(servermethod, userId,  !isOn)
        }} />
        )
    } else {
      return( <img src={imagesrc} style={s.icon} alt="status" /> )
    }
  }

  render() {
    var user = this.props.user;

    var name = '';
    var isActive = false;
    var picture = '';
    var canCreateLocations = false;
    var publickey = '';
    if (user.profile) {
        name = user.profile.name||'anoniem'
        isActive = user.profile.active|| false
        picture = user.profile.avatar|| ''
        canCreateLocations = user.profile.cancreatelocations|| false
        publickey = user.profile.wallet && user.profile.wallet.address|| ''
        if(publickey!='') publickey=publickey.substring(0,10)+'.....'
    }
    var email = user.emails ? user.emails[0].address : name + ' (no email)'
    var isAdmin = Roles.userIsInRole(user._id, 'admin');
    var readonly = (this.props.currentuser == user._id);

    backcolor = s.base.background;
    if(!this.state.showDetails) {
      // show admins and records that are not active in different color
      if(!isActive) {
        backcolor = 'red'
      } else if(isAdmin) {
        backcolor = 'yellow'
      }
    }

    return (
      <article style={Object.assign({}, s.base, {background: backcolor})} ref="base">
        <div style={s.textWrapper} ref="textWrapper">
          { !this.state.showDetails ?
              <ul style={s.list}>
                <li style={s.listitem}>{email}<img src={ s.images.details } style={s.icon} alt="toggle" onClick={() => this.setState(prevState => ({ showDetails: ! prevState.showDetails}))} /></li>
              </ul>
            :
              <ul style={s.list}>
                <li style={s.listitem}><img style={s.profilepicture} src={picture}/></li>
                <li style={s.listitem}>{name}</li>
                <li style={s.listitem}>{email}</li>
                <li style={s.listitem}>{publickey}</li>
                <li style={s.listitem}>Admin: { this.getToggleButton('currentuser.setAdmin', user._id, isAdmin, readonly, 'Weet je zeker dat je deze gebruiker admin rechten wilt geven?') }</li>
                <li style={s.listitem}>Active: { this.getToggleButton('currentuser.setActive', user._id, isActive, readonly) }</li>
                <li style={s.listitem}>Add locations: { this.getToggleButton('currentuser.canCreateLocations', user._id, canCreateLocations, false) }</li>
              </ul>
            }
          </div>
        </article>
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
  textWrapper: {
    flex: 2,
    fontWeight: 500,
    fontSize: '1.2em',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: '5px',
  },
  list: {
    margin: '0 auto',
    padding: 0,
    textAlign: 'center',
    listStyle: 'none',
  },
  listitem: {
    padding: '0 10px 0 0',
    margin: '0 auto',
    textAlign: 'center',
    minHeight: '40px',
    fontSize: '1.2em',
    fontWeight: '500',
    listStyle: 'none',
  },
  profilepicture: {
    display: 'inline-block',
    width: '200px',
    height: '200px',
    backgroundColor: '#fff',
    border: 'solid 2px #fff',
    borderRadius: '44px',
    backgroundColor: 'rgba(0, 208, 162, 0.05)',
  },
  icon: {
    width:'32px',
    height:' auto'
  },
  images: {
    details: '/files/IconsButtons/more-48.png', // https://cdn1.iconfinder.com/data/icons/general-9/500/more-48.png
    yes: '/files/IconsButtons/Tick_Mark_Dark-128.png', // 'https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Dark-128.png',
    no: '/files/IconsButtons/Close_Icon_Dark-128.png' // 'https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Close_Icon_Dark-128.png'
  },
}

UserDetails.propTypes = {
  user: PropTypes.object
};

UserDetails.defaultProps = {
  user: {}
}

export default UserDetails
