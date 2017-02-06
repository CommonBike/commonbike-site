import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';

// Import models
import { Objects } from '/imports/api/objects.js'; 

class CheckInOutProperies extends Component {

  constructor(props) {
    super(props);
    
    this.state = props.item
  }
    
  //+handleChange :: Event -> StateChange
  handleChange(e) {
    this.state.title = e.target.value;
    
    Meteor.call('objects.update', this.props.item._id, this.state);
  }

  // newAvatar :: Event -> NO PURE FUNCTION

  // newCode(e) {
  //   if( ! this.props.isEditable) return;

  //   var imageUrl =
  //     prompt('Wat is de URL van de nieuwe avatar? Wil je geen nieuwe avatar toevoegen, klik dan op Annuleren/Cancel')

  //   if(imageUrl) {
  //     this.state.imageUrl = imageUrl;
  //     Meteor.call('objects.update', this.props.item._id, this.state);
  //   }
  // }

  // RedirectTo('/bike/details/' + this.props.item._id) }
  // viewItem() { RedirectTo((this.props.isEditable ? '/admin/bike/details/' : '/bike/details/') + this.props.item._id) }

  // deleteItem() {
  //   if( ! confirm('Weet je zeker dat je de fiets "'+this.props.item.title+'" wilt verwijderen?') || ! confirm('Sure? If not sure: don\'t') )
  //     return;

  //   Meteor.call('objects.remove', this.props.item._id);
  // }

  getRandomKeycode(length=5) {
      var base = Math.pow(10, length+1);
      var code = Math.floor(base + Math.random() * base)
      return code.toString().substring(1, length+1);
  }

  render() {
      var keycode = ''; 
      if(this.object&&this.object.lock&&this.object.lock.keycode) {
        keycode = this.object.lock.keyid; 
      } else {
        keycode = this.getRandomKeycode()  
      }

    return (
      <article>
        <p>Keycode: {keycode}</p>
      </article>
    );
  }
}

CheckInOutProperies.propTypes = {
  object: PropTypes.object.isRequired,
  isEditable: PropTypes.any
};

CheckInOutProperies.defaultProps = {
  isEditable: false
}

export default CheckInOutProperies;
