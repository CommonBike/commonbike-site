import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import R from 'ramda';

// Import models
import { Locations } from '../../api/locations.js'; 

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx';

// Block component - Renders an item block
class Block extends Component {

  constructor(props) {
    super(props);
  }
    
  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.base).style.display = 'flex';
  }

  render() {
    return (
      <article style={Object.assign({}, s.base, ! this.props.isEditable && {cursor: 'pointer'})} onClick={this.props.onClick} ref="base">

        <div style={s.avatar} onClick={this.props.newAvatar.bind(this)}>
          <img src={this.props.item.imageUrl ? this.props.item.imageUrl : '/files/Block/bike.png'} alt="Bike" title="Le bike." />
        </div>

        { this.props.isEditable
          ? <ContentEditable style={s.title} html={this.props.item.title} disabled={false} onChange={this.props.handleChange.bind(this)} />
          : <span style={s.title} dangerouslySetInnerHTML={{__html: this.props.item.title}}></span> }

        <button style={Object.assign({display: 'none'}, s.deleteButton, this.props.isEditable && {display: 'block'})} onClick={this.props.deleteItem.bind(this)}>delete</button>
        <button style={Object.assign({display: 'none'}, s.infoButton, this.props.isEditable && {display: 'block'})} onClick={this.props.viewItem.bind(this)}>info</button>

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
  avatar: {
    flex: 1,
    maxHeight: '148px'
  },
  title: {
    flex: 2,
    fontSize: '1.2em',
    margin: '0 10px',
    fontWeight: 500
  },
  deleteButton: {
    cursor: 'cross',
    ':hover': {
      color: '#f00',
    }
  },
  infoButton: {
    marginLeft: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
}

Block.propTypes = {
  item: PropTypes.object.isRequired,
  isEditable: PropTypes.any,
  onClick: PropTypes.any,
  handleChange: PropTypes.any,
  viewItem: PropTypes.any,
  deleteItem: PropTypes.any,
};

Block.defaultProps = {
  isEditable: false,
}

export default Radium(Block);
