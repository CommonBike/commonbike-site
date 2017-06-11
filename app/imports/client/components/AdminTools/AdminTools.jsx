import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import { RedirectTo } from '/client/main'

// Import components
import RaisedButton from '../Button/RaisedButton';
import { getUserDescription } from '/imports/api/users.js';

class AdminTools extends Component {
  constructor(props) {
    super(props);
  }

  showAllTransactions() {
    RedirectTo('/admin/transactions');
  }

  clearTransactions() {
    if( !confirm('Weet je zeker dat je de complete transactie historie wilt wissen? Dit kan niet ongedaan gemaakt worden.')) {
      return;
    }

    Meteor.call('transactions.clearAll');
  }

  cleanTestUsers() {
    if( !confirm('Weet je zeker dat je alle testgebruikers wilt verwijderen? Dit kan niet ongedaan gemaakt worden.')) {
      return;
    }

    Meteor.call('testdata.cleanupTestUsers');

    alert('De testgebruikers zijn verwijderd!');
  }

  cleanTestData() {
    if( !confirm('Weet je zeker dat je alle testdata wilt verwijderen? Dit kan niet ongedaan gemaakt worden.')) {
      return;
    }

    Meteor.call('testdata.cleanupTestData');

    alert('De testdata is verwijderd!');
  }

  insertTestUsers() {
    if( !confirm('Weet je zeker dat je de testgebruikers wilt toevoegen? Doe dit nooit op de productieserver.')) {
      return;
    }

    Meteor.call('testdata.checkTestUsers');

    alert('De testgebruikers zijn toegevoegd!');
  }

  insertTestData() {
    if( !confirm('Weet je zeker dat je de testdata wilt toevoegen? Doe dit nooit op de productieserver.')) {
      return;
    }

    Meteor.call('testdata.checkTestLocations');

    alert('De testdata is toegevoegd!');
  }

  showLog() {
    RedirectTo('/admin/log');
  }

  databaseCheckup() {

  }

  databaseBackup() {
    Meteor.call('databasetools.backup');
  }

  databaseRestore() {

  }

  getOnlineOfflineButton() {
  }

  goOfflineOnline() {

  }

  render() {
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
        <div style={s.centerbox}>
          <RaisedButton onClick={this.databaseBackup.bind(this)}>DATABASE BACKUP</RaisedButton>
        </div>
        <div style={s.centerbox}>
          <RaisedButton onClick={this.showLog.bind(this)}>LOG TONEN</RaisedButton>
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

export default createContainer((props) => {
  Meteor.subscribe('users');

  return {
    currentUser: Meteor.users.findOne()
  };
}, AdminTools);

//
