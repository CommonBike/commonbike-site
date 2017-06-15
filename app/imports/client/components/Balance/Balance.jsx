import React, { Component, PropTypes } from 'react';
import ContentEditable from 'react-contenteditable';
import ReactDOM from 'react-dom';
import Radium from 'radium';

// Balance component - Renders an item Balance
class Balance extends Component {
  constructor(props) {
    super(props);

    console.log('balance constructor called');

    var Web3 = require("web3")
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.props.providerurl));
    if(this.web3.eth && this.web3.eth.watch) {
      console.log('has watch function!');
      // this.web3.eth.watch('chain').changed(()=>this.updateEtherBalance().bind(this));
      this.web3.eth.watch('chain').changed((i)=>console.log('chain changed!'));
    };

    this.state = { balance: "??????"};
  }

  updateEtherBalance() {
    // this.web3.eth.getBalance(this.props.address, (err, balance) => {
    //   if (err) {
    //     this.setState({balance: "-------"});
    //     return;
    //   }
    //
    //   this.setState({balance: Web3.fromWei(balance, 'ether').toNumber()});
    // }).bind(this);

    var balanceWei = this.web3.eth.getBalance(this.props.address);
    var balanceEth = this.web3.fromWei(balanceWei, 'ether').toNumber()
    console.log('new balance set for ' + this.props.address + ' ' + balanceEth)
    this.setState({balance: balanceEth});
  }

  componentDidMount() {
    this.updateEtherBalance();

    this.interval = setInterval(()=>this.updateEtherBalance(), 5000);
  }

  componentWillUnmount() {
    if(this.interval) clearInterval(this.interval);
  }

  render() {
    console.log()
    return (
      <div style={s.balance} ref="base">
        <div style={s.label}>{this.props.label}</div>
        <div style={s.label}>{this.state.balance}</div>
      </div>
    );
  }
}

var s = {
  balance: {
    border: 'none',
    display: 'block',
    backgroundColor: '#000',
    width: '100%',
    marginTop: '20px',
    marginRight: 'auto',
    marginBottom: '20px',
    marginLeft: 'auto',
    paddingTop: '15px',
    paddingRight: '0',
    paddingBottom: '15px',
    paddingLeft: '0',
    maxWidth: '400px',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '20px',
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
}

Balance.propTypes = {
  label: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  providerurl: PropTypes.string.isRequired
};

Balance.defaultProps = {
  label: 'SALDO',
  address: '',
  providerurl: ''
}

export default Radium(Balance);
