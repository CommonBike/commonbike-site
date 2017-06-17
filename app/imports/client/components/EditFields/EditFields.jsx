import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { RedirectTo } from '/client/main'

class EditFields extends Component {

  constructor(props) {
    super(props);

    this.state = { showDetails: false,
                   changes: {} }
  }

  apply() {
    if(this.props.apply&&(Object.keys(this.state.changes).length > 0)) {
      // for some types (boolean, ...) the control value needs to be converted
      // to pass the schema check
      var changes = this.state.changes;
      Object.keys(changes).forEach((fieldname) => {
        var itemidx = this.props.fields.findIndex((element)=>{return (element.fieldname==fieldname)});
        if(itemidx!=-1) {
          if(this.props.fields[itemidx].controltype=='yesno') {
            // yesno field: convert back to boolean
            changes[fieldname] = (changes[fieldname]=='true');
          } else if(this.props.fields[itemidx].controltype=='number') {
            // number field: convert back to number
            changes[fieldname] = Number(changes[fieldname]);
          }
        } else {
          console.log('field not found!');  // should not happen!
        }
      });

      if(this.props.apply(changes)) {
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
       <option key={option._id} value={option._id}>{option.title}</option>
    );
  }

  getField(field, key, actionhandler) {
    switch (field.controltype) {
      case 'header':
        return (
          <div style={s.header} key={key}>{field.label}</div>
        );

        break;
      case 'message':
        return (
          <div style={s.message} key={key}>{field.text}</div>
        );

        break;
      case 'text':
        return (
          <div style={s.editline} key={key}>
            <input style={s.control} type='INPUT' key={field.fieldname} name={field.fieldname} defaultValue={field.fieldvalue} onChange={this.onFieldChange.bind(this)} />
            <label style={s.label} key={'label_'+field.fieldname} htmlFor={field.fieldname}>{field.label}</label>
          </div>
        );

        break;
      case 'text-readonly':
        return (
          <div style={s.editline} key={key}>
            <input style={s.control} type='INPUT' key={field.fieldname} name={field.fieldname} defaultValue={field.fieldvalue} onChange={this.onFieldChange.bind(this)} readOnly />
            <label style={s.label} key={'label_'+field.fieldname} htmlFor={field.fieldname}>{field.label}</label>
          </div>
        );

        break;
      case 'number':
        return (
          <div style={s.editline} key={key}>
            <input style={s.control} type='INPUT' key={field.fieldname} name={field.fieldname} defaultValue={field.fieldvalue.toString()} onChange={this.onFieldChange.bind(this)} />
            <label style={s.label} key={'label_'+field.fieldname} htmlFor={field.fieldname}>{field.label}</label>
          </div>
        );

        break;
      case 'combo':
        return (
          <div style={s.editline} key={key}>
            <select style={s.control} key={field.fieldname} name={field.fieldname} defaultValue={field.fieldvalue} onChange={this.onFieldChange.bind(this)} >
                { R.map((option) => this.getOption(option, field) , field.options) }
            </select>
            <label style={s.label} key={'label_'+field.fieldname} htmlFor={field.fieldname}>{field.label}</label>
          </div>
        );

        break;
      case 'yesno':
        return (
          <div style={s.editline} key={key}>
            <select style={s.control} key={field.fieldname} name={field.fieldname} defaultValue={field.fieldvalue.toString()} onChange={this.onFieldChange.bind(this)} >
                <option key={'key.option.true'} value={true}>Ja</option>
                <option key={'key.option.false'} value={false}>Nee</option>
            </select>
            <label style={s.label} key={'label_'+field.fieldname} htmlFor={field.fieldname}>{field.label}</label>
          </div>
        );

        break;
      case 'serverside-action':
        return (
          <div style={s.editline} key={key}>
            <img style={s.controlicon} src={s.images.yes} onClick={()=>{actionhandler(field.fieldname)}} />
            <label style={s.label} key={'label_'+field.fieldname} htmlFor={field.fieldname}>{field.label}</label>
          </div>
        );

        break;
      default:
        return (<div />);
        break;
    }
  }

  actionhandler(name) {
    console.log('calling ' + name);
    Meteor.call(name);
  }

  render() {
    return (
      <div style={s.box}>
        <div style={s.titelbox}>
          {this.props.title}
          <img src={ s.images.details } style={s.editicon} alt="" onClick={() => this.setState(prevState => ({ showDetails: ! prevState.showDetails}))} />
        </div>

        { this.state.showDetails?
          <form type="" style={ s.editform } ref="theforminquestion">
            { R.map((field) => this.getField(field, field.label+'.'+field.fieldname||'control', this.actionhandler.bind(this)) , this.props.fields) // || 'control' -> because label has no fieldname
            }
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
    borderTop: '2px solid black',
    padding: '5px',
    margin: '0 0 5px 0'
  },
  message: {
    textAlign: 'center',
    fontSize: '14px',
    width: '100%',
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
  controlicon: {
    order: '2',
    // flex: '1 1 auto',
    textAlign: 'left',
    height:' 64px',
    width:'49px'
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
    details: '/files/IconsButtons/more-48.png', // https://cdn1.iconfinder.com/data/icons/general-9/500/more-48.png
    yes: '/files/IconsButtons/Tick_Mark_Dark-128.png', // 'https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Tick_Mark_Dark-128.png',
    no: '/files/IconsButtons/Close_Icon_Dark-128.png' // 'https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Close_Icon_Dark-128.png'
  },
}

EditFields.propTypes = {
  title: PropTypes.string,
  fields: React.PropTypes.arrayOf(
            React.PropTypes.shape({
              fieldname: React.PropTypes.string,
              fieldvalue: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.number,
                React.PropTypes.bool]),
              controltype: React.PropTypes.string,
              label: React.PropTypes.string
            })
          ),
  handlers: React.PropTypes.arrayOf(
            React.PropTypes.shape({
              name: React.PropTypes.string,
              functionname:PropTypes.func
            })
          ),
  apply: PropTypes.func
};

EditFields.defaultProps = {
  title: 'INSTELLINGEN',
  fields: [],
  handlers: []
}

export default EditFields
