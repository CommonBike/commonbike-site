var bip39 = require("bip39")
var HDWalletProvider = require("truffle-hdwallet-provider") // https://github.com/trufflesuite/truffle-hdwallet-provider
var Web3 = require("web3")

var token_abi = require('./CBCabi.json')

import { Settings } from '/imports/api/settings.js';
var settings = Settings.findOne({});
const token_address = settings.bikecoin.token_address || '0x560dae10c6f6655588d0d3596e757e3825dd55cfd331056ef69e4dc67a308cd5'
const provider_url  = settings.bikecoin.provider_url  || 'https://ropsten.infura.io/sCQUO1V3FOoOUWGZBtig'


export const newCBCkeypair = () => { // CBC = CommonBikeCoin
  const seedPhrase = bip39.generateMnemonic()
  const provider   = new HDWalletProvider(seedPhrase, provider_url)

  return {
    address: '0x' + provider.wallet.getAddress().toString("hex"),
    privatekey: seedPhrase,
  }
}
global.newCBCkeypair = newCBCkeypair


export const getToken = (seedPhrase) => {
  const provider = new HDWalletProvider(seedPhrase, provider_url)
  const web3     = new Web3(provider)
  return web3.eth.contract(token_abi).at(token_address)
}
global.getToken = getToken


// export default newCBCkeypair
