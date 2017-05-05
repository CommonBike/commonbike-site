import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';

// usage    <ManageUserlist methodsBaseName='locationprovider' parentId={this.props.locationId} />


class ManageAPIKeys extends Component {
  constructor(props) {
    super(props);

    this.state = { showDetails: false, APIKeysList: [] }
  }

  componentDidMount() {
    if(this.props.methodsBaseName && this.props.keyOwnerId) {
      Meteor.call('getAPIKeysList', this.props.keyOwnerId, this.props.keyType, this.updateAPIKeysList.bind(this));
    }
  }

  updateAPIKeysList(error, result) {
    if(error) return alert(error.error);

    // Reset input field
    ReactDOM.findDOMNode(this.refs.keyname).value = '';

    // Set new data
    this.setState(prevState => ({APIKeysList : result }));
  }

  reloadAPIKeysList(error, result) {
    if(error) return alert(error.error);

    Meteor.call('getAPIKeysList', this.props.keyOwnerId, this.props.keyType, this.updateAPIKeysList.bind(this));
  }

  addAPIKey(e) {
    if(e) e.preventDefault();
    keyName = ReactDOM.findDOMNode(this.refs.keyname).value;
    Meteor.call('addAPIKey', this.props.keyOwnerId, this.props.keyType, keyName, this.reloadAPIKeysList.bind(this));
  }

  removeAPIKey(keyId) {
    confirm('Sure?') && Meteor.call('removeAPIKey', this.props.keyOwnerId, keyId, this.reloadAPIKeysList.bind(this));
  }

  render() {
    self = this;

    return (
      <div style={s.box}>
        <div style={s.titel}>
          API Keys
          <img src={ s.images.details } style={s.icon} alt="toggle" onClick={() => this.setState(prevState => ({ showDetails: ! prevState.showDetails}))} />
        </div>

        { this.createList() }

      </div> 
    );
  }

  createList() {
    return (
      <div style={Object.assign({}, s.lijst, ! this.state.showDetails && {display: 'none'})}>

        <form style={Object.assign({display: 'flex'}, s.lijstitem)} onSubmit={this.addAPIKey.bind(this)}> 
          <TextField type="text" ref="keyname" placeholder="beschrijving" name="keyname" style={s.textField} />
          <button type="submit" style={s.addicon} ref="addAPIKey" title="add user" />
        </form>        

        {R.map((apikey) =>  <div style={s.lijstitem} key={apikey._id}>
                              <span>{apikey.name}</span>
                              {this.state.APIKeysList.length > 1 &&
                              <img style={s.icon}  src={s.images.trashcan} onClick={() => this.removeAPIKey(apikey._id) } />
                              }
                          </div>, this.state.APIKeysList)}
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
    background: 'url("https://cdn1.iconfinder.com/data/icons/general-9/500/add-48.png") center center / contain no-repeat',
    border: 'none'
  },

  icon: {
    width:'32px',
    height:' auto'
  },

  images: {
    details: 'https://cdn1.iconfinder.com/data/icons/general-9/500/more-48.png',
    trashcan: 'https://cdn4.iconfinder.com/data/icons/miu/24/editor-trash-delete-recycle-bin-glyph-48.png'
  },

  textField: {
    display: 'inline-block',
    width: '300px',
    maxWidth: '100%',
  },
}

ManageAPIKeys.propTypes = {
  keyType: PropTypes.string,    // type of key that is managed
  keyOwnerId: PropTypes.string, // id of document owns this key
};

ManageAPIKeys.defaultProps = {
  keyType: "",
  keyOwnerId: "",
}

export default ManageAPIKeys;
