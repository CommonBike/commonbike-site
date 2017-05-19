var bip39 = require("bip39")
var HDWalletProvider = require("truffle-hdwallet-provider") // https://github.com/trufflesuite/truffle-hdwallet-provider
var Web3 = require("web3")
var fs = require("fs")
var solc = require('solc')

var token_abi = require('/imports/api/smartcontracts/BikeCoinAbi.json') // note: perhaps we better store this in settings.bikecoin.abi

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

      const myContractReturned = contract.new(
        initialSupply, tokenName, decimalUnits, tokenSymbol,
        {from: wallet.address, data: bytecode, gas: 100000 + contractGasEstimate, gasPrice: web3.toWei(20, 'gwei')},
        (error, myContract) => {
          if (error) { console.error(error); return; }
          BikeCoin.myContract = myContract
          // console.log(myContract)
        }
      )
      // console.log('myContractReturned', myContractReturned)

      BikeCoin.contractReturned = myContractReturned
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
    if (!seedPhrase) {
      console.warn('BikeCoin.web3 missing seedPhrase')
      return
    }

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
    const { token_address } = Settings.findOne().bikecoin
    return this.web3(seedPhrase).eth.contract(token_abi).at(token_address)
  }

} // end of class BikeCoin

global.BikeCoin = BikeCoin
