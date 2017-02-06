import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { withRouter } from 'react-router';

// Import components
import RaisedButton from '../Button/RaisedButton';
import { getUserDescription } from '/imports/api/users.js'; 


class AdminTools extends Component {
  constructor(props) {
    super(props);
  }

  showAllTransactions() {
    this.context.history.push('/admin/transactions');
  }

  clearTransactions() { 
    if( !confirm('Weet je zeker dat je de complete transactie historie wilt wissen? Dit kan niet ongedaan gemaakt worden.')) {
      return;
    }

    Meteor.call('transactions.clearAll');
  }

  cleanTestUsers() {
    Meteor.call('testdata.cleanupTestUsers');
  }

  cleanTestData() {
    Meteor.call('testdata.cleanupTestData');
  }

  insertTestUsers() { 
    Meteor.call('testdata.checkTestUsers');
  }

  insertTestData() {
    Meteor.call('testdata.checkTestLocations');
  }

  databaseCheckup() {
    
  }

  databaseBackup() {

  }

  databaseRestore() {

  }

  getOnlineOfflineButton() {
  }

  goOfflineOnline() { 
    
  }

  render() {
    console.log('XXX: AdminTools'); console.log(this.props);
    return (
      <div style={s.base}>
        <div style={s.centerbox}>
          <RaisedButton onClick={this.showAllTransactions.bind(this)}>ALLE TRANSACTIES TONEN</RaisedButton>

          <RaisedButton onClick={this.clearTransactions.bind(this)}>TRANSACTIES OPSCHONEN</RaisedButton>
        </div>

        <div style={s.centerbox} hidden>
          <RaisedButton onClick={this.databaseCheckup.bind(this)}>DATABASE CHECKUP</RaisedButton>

          <RaisedButton onClick={this.databaseBackup.bind(this)}>DATABASE BACKUP</RaisedButton>

          <RaisedButton onClick={this.databaseRestore.bind(this)}>DATABASE RESTORE</RaisedButton>
        </div>

        <div style={s.centerbox}>

          <RaisedButton onClick={this.cleanTestUsers.bind(this)}>TESTGEBRUIKERS VERWIJDEREN</RaisedButton>

          <RaisedButton onClick={this.cleanTestData.bind(this)}>TESTDATA VERWIJDEREN</RaisedButton>

          <RaisedButton onClick={this.insertTestUsers.bind(this)}>TESTGEBRUIKERS TOEVOEGEN</RaisedButton>

          <RaisedButton onClick={this.insertTestData.bind(this)}>TESTDATA TOEVOEGEN</RaisedButton>

        </div>
      </div>
    );
  }
}

var s = {
  base: {
    padding: '10px 20px',
    textAlign: 'center'
  },
  personalia: {
    padding: '0 20px',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  avatar: {
    display: 'inline-block',
    width: '200px',
    height: '200px'
  },
  centerbox: {
    background: 'white',
    margin: '10px 0 10px 0',
    border: '1px solid black'
  }
}

AdminTools.propTypes = {
  locations: PropTypes.array,
  isEditable: PropTypes.any,
  clickItemHandler: PropTypes.any,
};

AdminTools.defaultProps = {
  isEditable: false
}

const AdminToolsWithRouter = withRouter(AdminTools)

export default createContainer((props) => {
  Meteor.subscribe('users');

  return {
    currentUser: Meteor.users.findOne()
  };
}, AdminToolsWithRouter);

//
