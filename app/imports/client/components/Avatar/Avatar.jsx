import React, { Component, PropTypes } from 'react';

Avatar = (props) => {
	if(!Meteor.user()||!Meteor.user().profile) {
		return (
			<div style={Object.assign({}, s.base, props.style)} />
		);
	} else if(!Meteor.user().profile.avatar) {
      return (
        <div style={Object.assign({}, s.base, props.style)} onClick={props.newAvatar} />
      );
  } else {
		return(
			<img style={Object.assign({}, s.base, props.style)} src={Meteor.user().profile.avatar} onClick={props.newAvatar} />
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

Avatar.propTypes = {
  newAvatar: PropTypes.any,
}

Avatar.defaultProps = {
  newAvatar: null
}

export default Avatar;
