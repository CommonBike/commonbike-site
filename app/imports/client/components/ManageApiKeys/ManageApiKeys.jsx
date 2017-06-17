import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';

// Import components
import TextField from '../TextField/TextField.jsx';
import CopyToClipboard from 'react-copy-to-clipboard';

export default class ManageApiKeys extends Component {
  constructor(props) {
    super(props);

    this.state = { showDetails: false, ApiKeysList: [] }
  }

  componentDidMount() {
   if(this.props.keyType && this.props.keyOwnerId) {
     Meteor.call('apikeys.getlist', this.props.keyOwnerId, this.props.keyType, this.updateApiKeysList.bind(this));
   }
  }

  updateApiKeysList(error, result) {
    if(error) return alert(error.error);

    // Reset input field
    ReactDOM.findDOMNode(this.refs.keyname).value = '';

    console.log(JSON.stringify(result, 0,2));

    // Set new data
    this.setState(prevState => ({ApiKeysList : result }));
  }

  reloadApiKeysList(error, result) {
    if(error) return alert(error.error);

    Meteor.call('apikeys.getlist', this.props.keyOwnerId, this.props.keyType, this.updateApiKeysList.bind(this));
  }


  addApiKey(e) {
    if(e) e.preventDefault();

    keyName = ReactDOM.findDOMNode(this.refs.keyname).value;
    console.log('keyname:' + keyName)
    Meteor.call('apikeys.add', this.props.keyOwnerId, this.props.keyType, keyName, this.reloadApiKeysList.bind(this));
  }

  removeApiKey(keyId) {
   confirm('Sure?') && Meteor.call('apikeys.remove', keyId, this.reloadApiKeysList.bind(this));
  }

  render() {
    self = this;

    return (
      <div style={s.box}>
        <div style={s.titel}>
          API KEYS
          <img src={ s.images.details } style={s.icon} alt="toggle" onClick={() => this.setState(prevState => ({ showDetails: ! prevState.showDetails}))}  />
        </div>

        { this.createList() }

      </div>
    );
  }

  createList() {
    return (
      <div style={Object.assign({}, s.lijst, ! this.state.showDetails && {display: 'none'})}>

        <form style={Object.assign({display: 'flex'}, s.lijstitem)} onSubmit={this.addApiKey.bind(this)}>
          <TextField type="text" ref="keyname" placeholder="beschrijving" name="keyname" style={s.textField} />
          <button type="submit" style={s.addicon} ref="addApiKey" title="add user" />
        </form>

        {R.map((apikey) =>  <div style={s.lijstitem} key={apikey._id}>
                              <CopyToClipboard text={apikey.key} onCopy={() => alert(apikey.key + " gekopieerd")} >
                                <img style={s.icon} src={s.images.clipboard} />
                              </CopyToClipboard>
                              <span>{apikey.name}</span>
                              <img style={s.icon} src={s.images.trashcan} onClick={() => this.removeApiKey(apikey._id) } />
                            </div>, this.state.ApiKeysList)}
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
    marginBottom: '10px',
    marginLeft: 'auto',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '20px',
  },

  titel: {
    border: 'none',
    display: 'block',
    backgroundColor: '#000',
    color: '#ffffff',
    padding: '10px',
  },

  lijst: {
    backgroundColor: '#fff',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '20px',
    padding: '10px',
    margin: '2px'
  },

  lijstitem: {
    borderBottom: '1px solid black',
    backgroundColor: '#fff',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '20px',
    padding: '10px',
    margin: '2px',
  },

  addicon: {
    height:'48px',
    width:' 48px',
    background: 'url("/files/IconsButtons/add-48.png") center center / contain no-repeat', // https://cdn1.iconfinder.com/data/icons/general-9/500/add-48.png
    border: 'none'
  },

  icon: {
    width:'32px',
    height:' auto'
  },

  images: {
    details: '/files/IconsButtons/more-48.png', // https://cdn1.iconfinder.com/data/icons/general-9/500/more-48.png
    trashcan: '/files/IconsButtons/editor-trash-delete-recycle-bin-glyph-48.png', // https://cdn4.iconfinder.com/data/icons/miu/24/editor-trash-delete-recycle-bin-glyph-48.png
    clipboard: '/files/IconsButtons/icon-clipboard-48.png' // https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-clipboard-48.png
  },

  textField: {
    display: 'inline-block',
    width: '300px',
    maxWidth: '100%',
  },
}

ManageApiKeys.propTypes = {
  keyType: PropTypes.string,    // type of key that is managed
  keyOwnerId: PropTypes.string, // id of document owns this key
};

ManageApiKeys.defaultProps = {
  keyType: "",
  keyOwnerId: "",
}
