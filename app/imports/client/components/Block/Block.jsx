import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import R from 'ramda';

// Import models
import { Locations } from '/imports/api/locations.js';

// Import components
import RaisedButton from '../Button/RaisedButton.jsx';

// helper functions
MillisectoHHMM = function (ms) {
  var sec_num = parseInt(ms/ 1000, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  return hours+':'+minutes;
}

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

  state2Text(state) {
    if (state=='r_available') {
      text = 'BESCHIKBAAR';
    } else if (state=='r_rentstart') {
      text = 'VERHUURD';
    } else if (state=='r_outoforder') {
      text = 'BUITEN GEBRUIK';
    } if (state=='available') {
      text = 'BESCHIKBAAR';
    } else if (state=='reserved') {
      text = 'GERESERVEERD';
    } else if (state=='inuse') {
      text = 'VERHUURD';
    } else if (state=='outoforder') {
      text = 'BUITEN GEBRUIK';
    } else {
      text = 'ONBEKEND';
    }

    return text;
  }

  rentalDetails2Text(item) {
    var userDescription = item.state.userDescription || 'anonymous';
    var duur = '';
    var nu = new Date().valueOf();
    if(item&&item.state) {
      duur = MillisectoHHMM(nu - item.state.timestamp);
    }

    return userDescription + ' (' + duur + ')';
  }

  lockDetailsToText(item) {
      return '.. lock details will appear soon! ..'
  }

  getPriceDescription(item) {
    if(this.props.item&&this.props.item.price) {
       return this.props.item.price.description;
    } else {
       return '';
     }
  }

  render() {
    return (
      <article style={Object.assign({}, s.base, ! this.props.isEditable && {cursor: 'pointer'})} onClick={this.props.onClick} ref="base">
        <div style={s.avatar} onClick={this.props.newAvatar} style={Object.assign({}, s.avatar, {backgroundImage: 'url("'+this.props.item.imageUrl+'")'})}
          onClick={this.props.newAvatar} />

        <div style={s.textWrapper} ref="textWrapper">

          { this.props.isEditable
            ? <ContentEditable style={s.title} html={this.props.item.title} disabled={false} onChange={this.props.handleChange} />
            : <div style={s.title} dangerouslySetInnerHTML={{__html: this.props.item.title}}></div> }

          <div style={Object.assign({display: 'none'}, s.objectdetails, (this.props.showPrice || this.props.showState || this.props.showRentalDetails || this.props.showLockDetails) && {display: 'block'})}>
             <div>{ this.props.showState && this.props.item.state ? this.state2Text(this.props.item.state.state) : null }</div>
             <div>{ this.props.showPrice ? <div dangerouslySetInnerHTML={{__html:this.getPriceDescription(this.props.item)}} /> : null }</div>
             <div>{ this.props.showRentalDetails && this.props.item ? this.rentalDetails2Text(this.props.item) : null }</div>
             <div>{ this.props.showLockDetails && this.props.item ? this.lockDetails2Text(this.props.item) : null }</div>
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
    width: '80px',
    height: '80px',
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
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
  objectdetails: {
    padding: '5px',
    margin: '5px 10px',
    fontSize: '0.7em',
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
  showPrice: PropTypes.any,
  showState: PropTypes.any,
  showRentalDetails: PropTypes.any,
  showLockDetails: PropTypes.any,
  onClick: PropTypes.any,
  handleChange: PropTypes.any,
  newAvatar: PropTypes.any,
  viewItem: PropTypes.any,
  deleteItem: PropTypes.any,
};

Block.defaultProps = {
  isEditable: false,
  showPrice: false,
  showState: false,
  showRentalDetails: false,
  showLockDetails: false
}

export default Radium(Block);
