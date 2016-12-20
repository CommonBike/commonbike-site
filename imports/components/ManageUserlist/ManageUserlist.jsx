import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import TextField from '../TextField/TextField.jsx';

class ManageUserlist extends Component {
  constructor(props) {
    super(props);

    this.state = { showDetails: false, userList: [], emailvalid: false }

    this.toggleShowDetails = this.toggleShowDetails.bind(this);

    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if(this.props.methodsBaseName && this.props.parentId) {
      Meteor.call(this.props.methodsBaseName + '.getuserlist', this.props.parentId , this.updateUserList.bind(this));
    }

    var textfield = ReactDOM.findDOMNode(this.refs.email);
    textfield.addEventListener("keydown", this.handleKey.bind(this));
//    textfield.addEventListener("change", this.handleChange.bind(this));

    var addbutton = ReactDOM.findDOMNode(this.refs.adduser);
    addbutton.addEventListener("click", this.addUser.bind(this));
  }

  componentWillUnmount() {
    var textfield = ReactDOM.findDOMNode(this.refs.email);
    textfield.removeEventListener("keydown", this.handleKey);
//    textfield.removeEventListener("change", this.handleChange);

    var addbutton = ReactDOM.findDOMNode(this.refs.adduser);
    addbutton.removeEventListener("click", this.addUser);
  }

  updateUserList(error, result) {
    if(!error) {
      this.setState(prevState => ({userList : result }));
    }
  }

  reloadUserList(error, result) {
    Meteor.call(this.props.methodsBaseName + '.getuserlist', this.props.parentId , this.updateUserList.bind(this));
  }

  toggleShowDetails() {
    this.setState(prevState => ({ showDetails: !prevState.showDetails}));
  }

  addUser() {
    var email = ReactDOM.findDOMNode(this.refs.email);
    if(email) {
      Meteor.call(this.props.methodsBaseName + '.adduser', this.props.parentId, email.value, this.reloadUserList.bind(this));
    }
  }

  removeUser(userId) {
    Meteor.call(this.props.methodsBaseName + '.removeuser', this.props.parentId, userId, this.reloadUserList.bind(this));
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
  //     Meteor.call('locationadmin.emailvalid', email.value, this.setEmailValid.bind(this));
  //   }
  // };

  handleKey(e) {
     if (e.key=='Enter') { 
      this.addUser();
    }
  }

  render() {
    self = this;

    return (
      <div style={s.box}>
        <div style={s.titel}>
          Beheerders
          <img src={ s.images.details } style={s.icon} alt="toggle" onClick={this.toggleShowDetails} />
        </div>

        { this.createList() }

      </div> 
    );
  }

  createList() {
    return (
      <div style={Object.assign({},s.lijst, !this.state.showDetails && {display: 'none'})}>
        <div style={s.lijstitem}> 
          <TextField type="email" ref="email" placeholder="nieuw e-mailadres" 
                     name="email" style={s.textField}
            />
          <img style={s.addicon} ref="adduser" src={s.images.add} alt="add user" />
        </div>        
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
    margin: '2px'
  },

  addicon: {
    height:'48px',
    width:' auto'
  },

  icon: {
    width:'32px',
    height:' auto'
  },

  images: {
    add: 'https://cdn1.iconfinder.com/data/icons/general-9/500/add-48.png',
    details: 'https://cdn1.iconfinder.com/data/icons/general-9/500/more-48.png',
    trashcan: 'https://cdn4.iconfinder.com/data/icons/miu/24/editor-trash-delete-recycle-bin-glyph-48.png'
  },

  textField: {
    display: 'inline-block',
    width: '300px',
    maxWidth: '100%',
  },
}

ManageUserlist.propTypes = {
  methodsBaseName: PropTypes.string,  // basename for server calls
  parentId: PropTypes.string,         // id of document that contains the admin field  
};

ManageUserlist.defaultProps = {
  methodsBaseName: "",
  parentId: "",
}

export default ManageUserlist;

