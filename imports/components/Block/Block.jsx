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
    // Hack around a bug in Radium:
    ReactDOM.findDOMNode(this.refs.base).style.display = 'flex';
    ReactDOM.findDOMNode(this.refs.textWrapper).style.display = 'flex';
  }

  render() {
    return (
      <article style={Object.assign({}, s.base, ! this.props.isEditable && {cursor: 'pointer'})} onClick={this.props.onClick} ref="base">

        <div style={s.avatar} onClick={this.props.newAvatar}>
          <img src={this.props.item.imageUrl ? this.props.item.imageUrl : '/files/Block/bike.png'} alt="Bike" title="Le bike." />
        </div>

        <div style={s.textWrapper} ref="textWrapper">

          { this.props.isEditable
            ? <ContentEditable style={s.title} html={this.props.item.title} disabled={false} onChange={this.props.handleChange} />
            : <div style={s.title} dangerouslySetInnerHTML={{__html: this.props.item.title}}></div> }

          <div style={Object.assign({display: 'none'}, s.price, this.props.showPrice && {display: 'block'})}>
            &euro;3,00 per dag
          </div>

        </div>

        <button style={Object.assign({display: 'none'}, s.deleteButton, this.props.isEditable && {display: 'block'})} onClick={this.props.deleteItem}>delete</button>
        <button style={Object.assign({display: 'none'}, s.infoButton, this.props.isEditable && {display: 'block'})} onClick={this.props.viewItem}>info</button>

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
  textWrapper: {
    flex: 2,
    fontWeight: 500,
    fontSize: '1.2em',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: '5px',
  },
  title: {
    margin: '0 10px',
  },
  price: {
    margin: '0 10px',
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
  newAvatar: PropTypes.any,
  viewItem: PropTypes.any,
  deleteItem: PropTypes.any,
};

Block.defaultProps = {
  isEditable: false,
  showPrice: false,
}

export default Radium(Block);
