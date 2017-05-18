var bip39 = require("bip39")
// // var Web3 = require("web3")
var HDWalletProvider = require("truffle-hdwallet-provider") // https://github.com/trufflesuite/truffle-hdwallet-provider

import { Settings } from '/imports/api/settings.js';

const newCBCkeypair = () => { // CBC = CommonBikeCoin
  const seedPhrase  = bip39.generateMnemonic()

  const providerURL = 'https://ropsten.infura.io/sCQUO1V3FOoOUWGZBtig'
  const provider    = new HDWalletProvider(seedPhrase, providerURL)
  // const web3        = new Web3(this.provider)

  const keypair = {
    address: '0x' + provider.wallet.getAddress().toString("hex"),
    privateKey: seedPhrase,
  }
  // console.warn(keypair)
  return keypair
}

export default newCBCkeypair

global.newCBCkeypair = newCBCkeypair
// global.Web3 = Web3
