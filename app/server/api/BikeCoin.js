var bip39 = require("bip39")
var HDWalletProvider = require("truffle-hdwallet-provider") // https://github.com/trufflesuite/truffle-hdwallet-provider
var Web3 = require("web3")
var fs = require("fs")
var solc = require('solc')

import { Settings } from '/imports/api/settings.js';


export default class BikeCoin {
  static settings() {
    console.log(Settings.findOne().bikecoin)
  }

  static deploy() {
    const { provider_url, wallet } = Settings.findOne().bikecoin
    const web3 = this.web3(wallet.privatekey)

    // cwd = ~/GitHub/commonbike-site/app/.meteor/local/build/programs/server
    const source = fs.readFileSync('../../../../../imports/api/smartcontracts/BikeCoin.sol', 'utf8');
    const compiledContract = solc.compile(source, 1) // 1 = enable optimizer

    const contractName = ':BikeCoin'
    const abi          = compiledContract.contracts[contractName].interface // note: perhaps we better store this in settings.bikecoin.abi
    const bytecode     = compiledContract.contracts[contractName].bytecode
    const contract     = web3.eth.contract(JSON.parse(abi))

    web3.eth.estimateGas({data: '0x' + bytecode}, (error, contractGasEstimate) => {
      BikeCoin.contractGasEstimate = contractGasEstimate
      // console.log('contractGasEstimate', contractGasEstimate)

      const initialSupply = 1000000
      const tokenName     = 'BikeCoin'
      const decimalUnits  = 2
      const tokenSymbol   = 'BC'

      contract.new(
        initialSupply, tokenName, decimalUnits, tokenSymbol,
        {from: wallet.address, data: bytecode, gas: 100000 + contractGasEstimate, gasPrice: web3.toWei(20, 'gwei')},
        (error, contract) => {
          if (error) { console.error(error); return; }
          // console.log(contract)
          BikeCoin.contract = contract

          // TODO:
          // var settingsId = Settings.findOne()._id;
          // var data = { 'bikecoin.token_address': contract.address, // (will be available after mining!)
          //              'bikecoin.token_abi': abi }
          //
          // Meteor.call('settings.update', settings._id, data);

          //    settings.bikecoin.token_address = contract.address (will be available after mining!)
          //    settings.bikecoin.token_abi = abi

          // note:
          //    // settings.bikecoin.wallet.address = 0xaa1fa720748bd61676d383d6b1e638df2c025577
          //    BikeCoin.contract().balanceOf(settings.bikecoin.wallet.address, (err,nBikeCoins)=>console.log(nBikeCoins.toNumber()))
        }
      )
    })

    // return {web3: web3, bytecode: bytecode, abi: abi, contract: contract}
  }

  static newKeypair() {
    const seedPhrase = bip39.generateMnemonic()
    const provider   = new HDWalletProvider(seedPhrase, Settings.findOne().bikecoin.provider_url)

    return {
      address: '0x' + provider.wallet.getAddress().toString("hex"),
      privatekey: seedPhrase,
    }
  }

  static web3(seedPhrase) {
    // if (!seedPhrase) {
    //   console.warn('BikeCoin.web3 missing seedPhrase')
    //   return
    // }

    const provider = new HDWalletProvider(seedPhrase, Settings.findOne().bikecoin.provider_url)
    return new Web3(provider)
  }

  static balance(seedPhrase) {
    const { wallet } = Settings.findOne().bikecoin
    this.web3(seedPhrase).eth.getBalance(wallet.address, (err, balance) => {
      console.log(err || balance.toNumber())
    })
  }

  static contract(seedPhrase) {
    const { token_address, token_abi } = Settings.findOne().bikecoin
    return this.web3(seedPhrase).eth.contract(JSON.parse(token_abi)).at(token_address)
  }

} // end of class BikeCoin

global.BikeCoin = BikeCoin
