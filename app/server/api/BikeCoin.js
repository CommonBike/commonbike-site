var bip39 = require("bip39")
var HDWalletProvider = require("truffle-hdwallet-provider") // https://github.com/trufflesuite/truffle-hdwallet-provider
var Web3 = require("web3")
var fs = require("fs")
var solc = require('solc')

import { Settings } from '/imports/api/settings.js';
import { logwrite } from '/imports/api/log.js';

const initialSupply = 1000000
const tokenName     = 'BikeCoin'
const decimalUnits  = 2
const tokenSymbol   = 'BC'

const gasMargin = 100000
const gasPrice = 20000000000


export default class BikeCoin {

  // General purpose helpers
  static settings() {
    console.log(Settings.findOne().bikecoin)
  }

  static newKeypair() {
    const seedPhrase = bip39.generateMnemonic()
    const provider   = new HDWalletProvider(seedPhrase, Settings.findOne().bikecoin.provider_url)

    return {
      address: '0x' + provider.wallet.getAddress().toString("hex"),
      privatekey: seedPhrase,
    }
  }

  static web3(seedPhrase) { // note: we only need to supply seedPhrase when we need to sign a transaction!
    const provider = new HDWalletProvider(seedPhrase, Settings.findOne().bikecoin.provider_url)
    return new Web3(provider)
  }


  // BikeCoin related helpers
  static deploy(filename = 'token/BikeCoin.sol') {
    const { provider_url, wallet } = Settings.findOne().bikecoin
    const web3 = BikeCoin.web3(wallet.privatekey)

    // cwd = ~/GitHub/commonbike-site/app/.meteor/local/build/programs/server
    const source = fs.readFileSync('../../../../../imports/api/smartcontracts/' + filename, 'utf8');
    const compiledContract = solc.compile(source, 1) // 1 = enable optimizer

    const contractName = ':BikeCoin'
    const abi          = compiledContract.contracts[contractName].interface // note: perhaps we better store this in settings.bikecoin.abi
    const bytecode     = compiledContract.contracts[contractName].bytecode
    const contract     = web3.eth.contract(JSON.parse(abi))

    web3.eth.estimateGas({data: '0x' + bytecode}, Meteor.bindEnvironment((error, contractGasEstimate) => {
      contract.new(
        initialSupply, tokenName, decimalUnits, tokenSymbol,
        {from: wallet.address, data: bytecode, gas: gasMargin + contractGasEstimate, gasPrice: gasPrice},
        Meteor.bindEnvironment((error, contract) => {
          if (error) {
            Meteor.call('log.write', "BikeCoin: Unable to deploy", JSON.stringify(error));
            console.error(error);
            return;
          }

          // console.log(contract)
          var settings = Settings.findOne();
          BikeCoin.contract = contract;
          if(contract.address) {
            Settings.update(settings._id, {$set : { 'bikecoin.token_address' : contract.address,
      		                                          'bikecoin.token_abi' :  abi }});
            logwrite("BikeCoin: Contract deployed at address " + contract.address);
          } else {
            Settings.update(settings._id, {$set : { 'bikecoin.token_address' : '<waiting for deployment>',
      		                                          'bikecoin.token_abi' :  abi }});
            logwrite("BikeCoin: Waiting for contract deployment");
          }
        })
      )
    }))
    // return {web3: web3, bytecode: bytecode, abi: abi, contract: contract}
  }

  static bikeCoinsInstance(seedPhrase) {
    const { token_address, token_abi } = Settings.findOne().bikecoin
    const web3 = BikeCoin.web3(seedPhrase)
    return web3.eth.contract(JSON.parse(token_abi)).at(token_address)
  }

  static bikeCoinsBalance(address) {
    BikeCoin.bikeCoinsInstance().balanceOf(address, (err, nBikeCoins) => console.log(address, 'owns', nBikeCoins.toNumber() / Math.pow(10, decimalUnits), tokenSymbol))
  }

  static bikeCoinsBalanceOfApp() {
    BikeCoin.bikeCoinsBalance(Settings.findOne().bikecoin.wallet.address)
  }

  static bikeCoinsSend(fromSeedPhrase, toAddress, amount=0.01) {
    const web3 = BikeCoin.web3(fromSeedPhrase)
    const fromAddress = web3.currentProvider.getAddress().toString('hex')
    // console.log(fromSeedPhrase, toAddress, amount, fromAddress)

    BikeCoin.bikeCoinsInstance(fromSeedPhrase).transfer(
      toAddress, Math.floor(amount * Math.pow(10, decimalUnits)),
      {from: fromAddress, gas: gasMargin + 21000, gasPrice: gasPrice},
      (err, result) => {
        if (err) { console.error(err); return; }
        console.log(fromAddress, 'sent', amount, tokenSymbol, 'to', toAddress, 'with txhash', result)
      }
    )
  }

  static bikeCoinsSendByApp(toAddress, amount=0.01) { // owner is the account the deployed the BikeCoin (this script/webapp)
    BikeCoin.bikeCoinsSend(Settings.findOne().bikecoin.wallet.privatekey, toAddress, amount)
  }


  // ETH related helpers
  static etherBalance(address) {
    const web3 = BikeCoin.web3()

    web3.eth.getBalance(address, (err, balance) => {
      if (err) { console.error(err); return; }
      console.log(address, 'owns', web3.fromWei(balance, 'ether').toNumber(), 'ETH')
    })
  }

  static etherBalanceOfApp() {
    BikeCoin.etherBalance(Settings.findOne().bikecoin.wallet.address)
  }

  static etherSend(fromSeedPhrase, toAddress, amount=0.01) {
    const web3 = BikeCoin.web3(fromSeedPhrase)
    const fromAddress = web3.currentProvider.getAddress().toString('hex')
    // console.log('fromAddress', fromAddress)

    web3.eth.sendTransaction(
      {from: fromAddress, to: toAddress, value: web3.toWei(amount, 'ether'), gas: gasMargin + 21000, gasPrice: gasPrice},
      (err, result) => {
        if (err) { console.error(err); return; }
        console.log(fromAddress, 'sent', amount, 'ETH to', toAddress, 'with txhash', result)
      }
    )
  }

  static etherSendByApp(toAddress, amount=0.01) { // owner is the account the deployed the BikeCoin (this script/webapp)
    BikeCoin.etherSend(Settings.findOne().bikecoin.wallet.privatekey, toAddress, amount)
  }

} // end of class BikeCoin

global.BikeCoin = BikeCoin

if(Meteor.isServer) {
   Meteor.methods({
    'bikecoin.deploycontract'() {
      if(!Roles.userIsInRole(Meteor.userId(), 'admin')) {
        // only administrators can deploy
        logwrite('Attempt to deploy BikeCoin contract by unauthorized user ' + Meteor.userId());
        return;
      }

      logwrite('New version of BikeCoin contract deployed by user ' + Meteor.userId());
      BikeCoin.deploy();
    },
  });
}
