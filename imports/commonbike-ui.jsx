import React, { Component, PropTypes } from 'react';

// Import components
import ItemBlock from '/imports/components/ItemBlock/ItemBlock.jsx';

class CommonBikeUI extends Component {

  render() {
    return (
      <div style={s.base}>

        <tt>
          <b>Hr</b> :: void
        </tt>

        <Hr />

        <tt>
          <b>ItemBlock</b> :: Object [ title: String, isEditable: Boolean ]
        </tt>

        <ItemBlock item={{title: 'This is an item block'}} isEditable={true} />

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
