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
    
    this.state = { title: props.item.title, imageUrl: props.item.imageUrl }
  }
    
  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.base).style.display = 'flex';
  }

  //+handleChange :: Event -> StateChange
  handleChange(e) {
    this.state.title = e.target.value;
    
    Meteor.call('locations.update', this.props.item._id, this.state);
  }

  // newAvatar :: Event -> NO PURE FUNCTION
  newAvatar(e) {
    if( ! this.props.isEditable) return;

    var imageUrl =
      prompt('Wat is de URL van de nieuwe avatar? Wil je geen nieuwe avatar toevoegen, klik dan op Annuleren/Cancel')

    if(imageUrl) {
      this.state.imageUrl = imageUrl;
      Meteor.call('locations.update', this.props.item._id, this.state);
    }
  }

  viewItem() {
    console.log('viewItem: ', this.props.item._id);
    FlowRouter.go('adminLocation', {locationId: this.props.item._id})
  }

  deleteItem() {
    if( ! confirm('Weet je zeker dat je locatie '+this.props.item.title+' wilt verwijderen?') || ! confirm('Sure? If not sure: don\'t') )
      return;

    Meteor.call('locations.remove', this.props.item._id);
  }

  render() {
    return (
      <article style={s.base} onClick={this.props.onClick} ref="base">
        <div style={s.avatar} onClick={this.newAvatar.bind(this)}>
          <img src={this.state.imageUrl ? this.state.imageUrl : '/files/Block/bike.png'} alt="Bike" title="Le bike." />
        </div>
        {this.props.isEditable ? <ContentEditable style={s.title} html={this.state.title} disabled={false} onChange={this.handleChange.bind(this)} /> : <span style={s.title} dangerouslySetInnerHTML={{__html: this.state.title}}></span>}
        <button style={Object.assign({display: 'none'}, s.deleteButton, this.props.isEditable && {display: 'block'})} onClick={this.deleteItem.bind(this)}>delete</button>
        <button style={Object.assign({display: 'none'}, s.infoButton, this.props.isEditable && {display: 'block'})} onClick={this.viewItem.bind(this)}>info</button>
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
};

Block.defaultProps = {
  isEditable: false
}

export default Radium(Block);
