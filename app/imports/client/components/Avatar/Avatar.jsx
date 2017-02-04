import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

AvatarComponent = (props) => {
	if(!props.currentUser||!props.currentUser.profile) {
		return (
			<div style={Object.assign({}, s.base, props.style)} />
		);
	} else if(!props.currentUser.profile.avatar) {
      return (
        <div style={Object.assign({}, s.base, props.style)} onClick={props.newAvatar} />
      );
  } else {
		return(
			<img style={Object.assign({}, s.base, props.style)} src={props.currentUser.profile.avatar} onClick={props.newAvatar} />
	  	);
  	}
}

var s = {
  base: {
    backgroundColor: '#fff',
    width: '44px',
    height: '44px',
    border: 'solid 2px #fff',
    borderRadius: '44px',
    backgroundColor: 'rgba(0, 208, 162, 0.05)',
  }
}

AvatarComponent.propTypes = {
  currentUser: PropTypes.object,
  newAvatar: PropTypes.any,
}

AvatarComponent.defaultProps = {
  currentUser: null,
  newAvatar: null
}

// export  Avatar;

export default Avatar = createContainer((props) => {
  return {
    currentUser: Meteor.user()
  };
}, AvatarComponent);
