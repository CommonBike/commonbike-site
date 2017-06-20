import { Settings } from '/imports/api/settings.js';
import { logwrite } from '/imports/api/log.js';

// used in the utility functions
import { getUserDescription } from '/imports/api/users.js';
import { Objects } from '/imports/api/objects.js';


export default class BikeCoinServerSide {

   // BikeCoin related helpers
   static deploy(filename = 'token/BikeCoin.sol') {
     const { wallet } = Settings.findOne().bikecoin
     const web3 = BikeCoin.web3(wallet.privatekey)

     // cwd = ~/GitHub/commonbike-site/app/.meteor/local/build/programs/server
     var fs = require("fs")
     var solc = require('solc')
     const source = fs.readFileSync('../../../../../imports/api/smartcontracts/' + filename, 'utf8');

     const compiledContract = solc.compile(source, 1) // 1 = enable optimizer

     const contractName = ':BikeCoin'
     const abi          = compiledContract.contracts[contractName].interface // note: perhaps we better store this in settings.bikecoin.abi
     const bytecode     = compiledContract.contracts[contractName].bytecode
     const contract     = web3.eth.contract(JSON.parse(abi))

     web3.eth.estimateGas({data: '0x' + bytecode}, Meteor.bindEnvironment((error, contractGasEstimate) => {
       if (error) {
         console.error(error)
         return
       }

       contract.new(
         BikeCoin.initialSupply, BikeCoin.tokenName, BikeCoin.decimalUnits, BikeCoin.tokenSymbol,
         {from: wallet.address, data: bytecode, gas: BikeCoin.gasMargin + contractGasEstimate, gasPrice: BikeCoin.gasPrice},
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
   static listUserAccounts() {
     var myUsers = Meteor.users.find().fetch();
     _.each(myUsers, function (user) {
   		if(user.profile && user.profile.wallet && user.profile.wallet.address!='') {
   			console.log(getUserDescription(user) + ' [' + user._id + ']: ' +  user.profile.wallet.address);
   		}
     })
   }

   static listBalances() {
     var myUsers = Meteor.users.find().fetch();
     _.each(myUsers, function (user) {
   		if(user.profile && user.profile.wallet && user.profile.wallet.address!='') {
   			console.log(BikeCoin.etherBalanceOfUser(user._id));
   		}
     })
     var myObjects = Objects.find().fetch();
     console.log(myObjects);
     _.each(myObjects, function (object) {
   		if(object.wallet && object.wallet.address!='') {
         console.log(BikeCoin.etherBalanceOfObject(object._id));
   		}
     })
   }

   static listObjectAccounts() {
     var myObjects = Objects.find().fetch();
     console.log(myObjects);
     _.each(myObjects, function (object) {
   		if(object.wallet && object.wallet.address!='') {
   			console.log(object.title + ' [' + object._id + ']: ' +  object.wallet.address);
   		}
     })
   }
   static spoilUsers(amountEther = 0.01) {
     var myUsers = Meteor.users.find().fetch();
     _.each(myUsers, function (user) {
   		if(user.profile && user.profile.wallet && user.profile.wallet.address) {
         BikeCoin.etherSendByApp(user.profile.wallet.address.substring(2), amountEther);
   		}
     })
   }

   static spoilObjects(amountEther = 0.01) {
     var myObjects = Objects.find().fetch();
     console.log(myObjects);
     _.each(myObjects, function (object) {
       if(object.wallet && object.wallet.address!='') {
         BikeCoin.etherSendByApp(object.wallet.address.substring(2), amountEther);
         console.log(object.title + ' [' + object._id + ']: ' +  object.wallet.address);
       }
     })
   }
 }

 Meteor.methods({
  'bikecoin.deploycontract'() {
    if(!Roles.userIsInRole(Meteor.userId(), 'admin')) {
      // only administrators can deploy
      logwrite('Attempt to deploy BikeCoin contract by unauthorized user ' + Meteor.userId());
      return;
    }

    logwrite('New version of BikeCoin contract deployed by user ' + Meteor.userId());
    BikeCoinServerSide.deploy();
  },
});

global.BikeCoinServerSide = BikeCoinServerSide
