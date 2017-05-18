var HDWalletProvider = require("truffle-hdwallet-provider") // https://github.com/trufflesuite/truffle-hdwallet-provider
var Web3 = require("web3")
var bip39 = require("bip39")

import { Settings } from '/imports/api/settings.js';

const newCBCkeypair = () => { // CBC = CommonBikeCoin
  console.warn('newCBCkeypair start')

  // const providerURL = Settings.findOne(


  const seedPhrase  = bip39.generateMnemonic()
  const providerURL = 'https://ropsten.infura.io/sCQUO1V3FOoOUWGZBtig'
  const provider    = new HDWalletProvider(seedPhrase, providerURL)
  const web3        = new Web3(this.provider)

  const keypair = {
    address: '0x' + provider.wallet.getAddress().toString("hex"),
    privateKey: seedPhrase,
  }
  console.warn('newCBCkeypair end', keypair)

  return keypair
}

export default newCBCkeypair

global.newCBCkeypair = newCBCkeypair
