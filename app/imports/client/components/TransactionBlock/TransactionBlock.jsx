import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';

// Block component - Renders an item block
class TransactionBlock extends Component {

  constructor(props) {
    super(props);
  }
    
  componentDidMount() {
    // Hack around a bug in Radium:
    ReactDOM.findDOMNode(this.refs.base).style.display = 'flex';
    ReactDOM.findDOMNode(this.refs.textWrapper).style.display = 'flex';
  }

  render() {
    return (
      <article style={Object.assign({}, s.base, ! this.props.isEditable && {cursor: 'pointer'})} onClick={this.props.onClick} ref="base">
        <div style={s.textWrapper} ref="textWrapper"><p>{this.props.item.description}</p></div>
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
}

TransactionBlock.propTypes = {
  item: PropTypes.object.isRequired,
  isEditable: PropTypes.any,
};

TransactionBlock.defaultProps = {
  isEditable: false
}

export default Radium(TransactionBlock);
