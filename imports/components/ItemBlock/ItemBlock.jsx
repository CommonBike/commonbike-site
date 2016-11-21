import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import R from 'ramda';

// Import models
import { Locations } from '../../api/locations.js'; 

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx';

// ItemBlock component - Renders an item block
class ItemBlock extends Component {

  constructor(props) {
    super(props);
    
    this.state = { title: props.item.title }
  }

  //+handleChange :: Event -> StateChange
  handleChange(e) {
    this.state.title = e.target.value;
    
    Meteor.call('locations.update', this.props.item._id, this.state);
  }

  deleteItem() {
    if( ! confirm('Weet je zeker dat je locatie '+this.props.item.title+' wilt verwijderen?') || ! confirm('Sure? If not sure: don\'t') )
      return;

    Meteor.call('locations.remove', this.props.item._id);
  }

  render() {
    return (
      <article style={s.base}>
        <div style={s.avatar}>
          <img src="/files/ItemBlock/bike.png" alt="Bike" title="Le bike." />
        </div>
        <ContentEditable style={s.title} html={this.state.title} disabled={false} onChange={this.handleChange.bind(this)} />
        <a style={s.delete} onClick={this.deleteItem.bind(this)}>delete</a>
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
    width: '100%',
    maxWidth: '400px',
    margin: '20px',
    borderBottom: 'solid 5px #bc8311',
  },
  avatar: {
    flex: 1,
    height: '148px'
  },
  title: {
    flex: 2,
    fontSize: '1.2em',
    margin: '0 10px',
    fontWeight: 'bold'
  },
}

ItemBlock.propTypes = {
  item: PropTypes.object.isRequired
};

export default ItemBlock;
