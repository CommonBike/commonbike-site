import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import {propTypes} from 'react-router';

class EditFields extends Component {

  constructor(props) {
    super(props);

    this.state = { showDetails: false,
                   changes: {} }
  }

  apply() {
    if(this.props.apply&&(Object.keys(this.state.changes).length > 0)) {
      if(this.props.apply(this.state.changes)) {
        this.setState( {changes: { }});
      }
    }
  }

  reset(e) {
    this.refs.theforminquestion.reset();
    this.setState( {changes: { }, showDetails: false});
  }

  onFieldChange(e) {
    var newChanges = this.state.changes;
    if(e.target.value!=e.target.defaultValue) {
      newChanges[e.target.name] = e.target.value;
    } else {
      delete newChanges[e.target.name]; // original value is back :-)
    }
    this.setState( { changes: newChanges } );
  }

  getOption(option, field) {
    return (
       <option defaultValue={field.defaultValue} key={option._id} value={option._id}>{option.title}</option>
    );
  }

  getField(field) {
    switch (field.controltype) {
      case 'header':
        return (
          <div style={s.header}>{field.label}</div>
        );

        break;
      case 'text':
        return (
          <div style={s.editline} key={'div_'+field.fieldname}>
            <input style={s.control} type='INPUT' key={field.fieldname} name={field.fieldname} defaultValue={field.fieldvalue} onChange={this.onFieldChange.bind(this)} />
            <label style={s.label} key={'label_'+field.fieldname} htmlFor={field.fieldname}>{field.label}</label>
          </div>
        );

        break;
      case 'combo':
        return (
          <div style={s.editline} key={'div_'+field.fieldname}>
            <select style={s.control} key={field.fieldname} name={field.fieldname} defaultValue={field.fieldvalue} onChange={this.onFieldChange.bind(this)} >
                { R.map((option) => this.getOption(option, field) , field.options) }
            </select>
            <label style={s.label} key={'label_'+field.fieldname} htmlFor={field.fieldname}>{field.label}</label>
          </div>
        );

        break;
      default: 
        return (<div />);
        break;
    }
  }

  render() {
    return (
      <div style={s.box}>
        <div style={s.titelbox}>
          {this.props.title}
          <img src={ s.images.details } style={s.editicon} alt="toggle" onClick={() => this.setState(prevState => ({ showDetails: ! prevState.showDetails}))} />
        </div>

        { this.state.showDetails?
          <form style={ s.editform } ref="theforminquestion">
            { R.map((field) => this.getField(field) , this.props.fields) }
            <div style={s.confirmline}>
                <div />
                <img src={s.images.yes} style={s.icon} onClick={this.apply.bind(this)} hidden={Object.keys(this.state.changes).length==0}/>          
                <img src={s.images.no} style={s.icon} onClick={this.reset.bind(this)} />          
            </div>
          </form>
          :null
        }
      </div> 
    );
  }
}

var s = {
  box: {
    border: '2px solid black',
    backgroundColor: '#fff',
    width: '100%',
    marginTop: '10px',
    marginRight: 'auto',
    marginBottom: '20px',
    marginLeft: 'auto',
    maxWidth: '400px',
    color: '#000',
  },
  titelbox: {
    border: 'none',
    display: 'block',
    backgroundColor: '#000',
    color: '#ffffff',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  editform: {
    paddingTop: '10px'
  },
  container: {
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',

    fontWeight: 'smaller',
    lineHeight: 'smaller',
    padding: '10px',
    maxWidth: '100%',
    width: '400px',
    margin: '20px auto',
    borderBottom: 'solid 5px #bc8311',
    textAlign: 'left',
  },
  editline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: '100%',
    margin: '0.2em',
  },
  confirmline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  header: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px',
    width: '100%',
    borderBottom: '2px solid black',
    padding: '5px',
    margin: '0 0 5px 0'
  },
  label: {
    order: '1',
    width: '6em',
    paddingRight: '0.2em',
    textAlign: 'left',
    },
  control: {
    order: '2',
    flex: '1 1 auto',
    textAlign: 'left'
  },
  icon: {
    width:'49px',
    height:' 64px'
  },
  editicon: {
    width:'32px',
    height:' auto'
  },
  images: {
    details: 'https://cdn1.iconfinder.com/data/icons/general-9/500/more-48.png',
    yes: 'https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Dark-128.png',
    no: 'https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Close_Icon_Dark-128.png'
  },
}

EditFields.contextTypes = {
  history: propTypes.historyContext
}

EditFields.propTypes = {
  title: PropTypes.string,
  fields: React.PropTypes.arrayOf(
            React.PropTypes.shape({
              fieldname: React.PropTypes.string,
              fieldvalue: React.PropTypes.string,
              controltype: React.PropTypes.string,
              label: React.PropTypes.string
            })
          ),
  apply: PropTypes.func
};

EditFields.defaultProps = {
  title: 'Instellingen',
  fields: [] 
}

export default EditFields;