import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';

// Import components
import TextField from '../TextField/TextField.jsx';

export default class ManageUserlist extends Component {
  constructor(props) {
    super(props);

    this.state = { showDetails: false, userList: [], emailvalid: false }
  }

  componentDidMount() {
    if(this.props.methodsBaseName && this.props.parentId) {
      Meteor.call(this.props.methodsBaseName + '.getuserlist', this.props.parentId , this.updateUserList.bind(this));
    }
  }

  updateUserList(error, result) {
    if(error) return alert(error.error);

    // Reset input field
    ReactDOM.findDOMNode(this.refs.email).value = '';

    // Set new data
    this.setState(prevState => ({userList : result }));
  }

  reloadUserList(error, result) {
    if(error) return alert(error.error);

    Meteor.call(this.props.methodsBaseName + '.getuserlist', this.props.parentId , this.updateUserList.bind(this));
  }

  addUser(e) {
    if(e) e.preventDefault();
    emailAddress = ReactDOM.findDOMNode(this.refs.email).value;
    Meteor.call(this.props.methodsBaseName + '.adduser', this.props.parentId, emailAddress, this.reloadUserList.bind(this));
  }

  removeUser(userId) {
    confirm('Sure?') && Meteor.call(this.props.methodsBaseName + '.removeuser', this.props.parentId, userId, this.reloadUserList.bind(this));
  }

  // NICE TO HAVE: enable these event handlers + corresponding code above to enable the add button when a valid email address has been
  // typed by the user
  // setEmailValid(error, emailvalid) {
  //   if(!error) {
  //     console.log('emailvalid set to:', emailvalid);

  //     this.setState({ emailvalid: emailvalid});
  //   }
  // }
  // handleChange(e) {
  //   var email = ReactDOM.findDOMNode(this.refs.email);
  //   if(email.value.includes('@')) {
  //     Meteor.call(this.props.methodsBaseName + '.emailvalid', email.value, this.setEmailValid.bind(this));
  //   }
  // };

  render() {
    self = this;

    return (
      <div style={s.box}>
        <div style={s.titel}>
          BEHEERDERS
          <img src={ s.images.details } style={s.icon} alt="" onClick={() => this.setState(prevState => ({ showDetails: ! prevState.showDetails}))} />
        </div>

        { this.createList() }

      </div>
    );
  }

  createList() {
    return (
      <div style={Object.assign({}, s.lijst, ! this.state.showDetails && {display: 'none'})}>

        <form style={Object.assign({display: 'flex'}, s.lijstitem)} onSubmit={this.addUser.bind(this)}>
          <TextField type="email" ref="email" placeholder="nieuw e-mailadres"
                     name="email" style={s.textField}
            />
          <button type="submit" style={s.addicon} ref="adduser" title="add user" />
        </form>

        {R.map((user) =>  <div style={s.lijstitem} key={user._id}>
                              <span>{user.email}</span>
                              {this.state.userList.length > 1 &&
                              <img style={s.icon}  src={s.images.trashcan} onClick={() => this.removeUser(user._id) } />
                              }
                          </div>, this.state.userList)}

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
  },

  textField: {
    display: 'inline-block',
    width: '300px',
    maxWidth: '100%',
  },
}

ManageUserlist.propTypes = {
  methodsBaseName: PropTypes.string,  // basename for server calls
  parentId: PropTypes.string,         // id of document that stores the user list
};

ManageUserlist.defaultProps = {
  methodsBaseName: "",
  parentId: "",
}
