import React, { Component, PropTypes } from 'react';

// Import components
import Block from '/imports/components/Block/Block.jsx';
import Hr from '/imports/components/Hr/Hr.jsx';

class CommonBikeUI extends Component {

  render() {
    return (
      <div style={s.base}>

        <tt>
          <b>Hr</b> :: void
        </tt>

        <Hr />

        <tt>
          <b>Block</b> :: Object [ title: String, isEditable: Boolean ]
        </tt>

        <Block item={{title: 'This is an item block'}} isEditable={true} />

      </div>
    );
  }
}

s = {
  base: {
    padding: '40px 20px 0 20px',
    background: '#fbae17',
    minHeight: '100%',
  }
}

export default CommonBikeUI;
