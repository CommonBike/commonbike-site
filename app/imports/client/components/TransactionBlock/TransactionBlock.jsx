import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';

// Block component - Renders an item block
class TransactionBlock extends Component {

  constructor(props) {
    super(props);
  }
    
  render() {
    return (
      <div style={Object.assign({}, s.base, ! this.props.isEditable && {cursor: 'pointer'})} onClick={this.props.onClick} ref="base">
        {this.props.item.description}
      </div>
    );
  }
}

var s = {
  base: {
    background: '#fff',
    display: 'flex',
    fontWeight: 'normal',
    lineHeight: 'normal',
    maxWidth: '100%',
    width: '400px',
    margin: '10px auto',
    textAlign: 'left',
    fontSize: '1em',
    padding: '10px',
    border: '1px solid black'
  },
}

TransactionBlock.propTypes = {
  item: PropTypes.object.isRequired,
  isEditable: PropTypes.any,
};

TransactionBlock.defaultProps = {
  isEditable: false
}

export default Radium(TransactionBlock);