import React, { Component, PropTypes } from 'react';

// Import components
import AccountsUIWrapper from '/imports/containers/AccountsUIWrapper/AccountsUIWrapper.jsx';
import Block from '/imports/components/Block/Block.jsx';
import Button from '/imports/components/Button/Button.jsx';
import Hr from '/imports/components/Hr/Hr.jsx';
import Avatar from '/imports/components/Avatar/Avatar.jsx';
import CheckInCode from '/imports/components/CheckInCode/CheckInCode.jsx';
import LoginForm from '/imports/components/LoginForm/LoginForm.jsx';

class CommonBikeUI extends Component {

  render() {
    return (
      <div style={s.base}>

        <h1>Basic UI component</h1>

        <AccountsUIWrapper />

        <Hr />

        <h1>Button</h1>

        <Button>Klik hier!</Button>

        <Hr />

        <h1>Avatar</h1>

        <Avatar />

        <Hr />

        <h1>CheckInCode</h1>

        <CheckInCode />

        <h1>LoginForm</h1>

        <LoginForm />

      </div>
    );
  }
}

s = {
  base: {
    padding: '40px 20px 0 20px',
    background: '#eee',
    minHeight: '100%',
  }
}

export default CommonBikeUI;