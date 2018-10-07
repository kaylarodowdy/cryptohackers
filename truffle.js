var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'bamboo creek motor arm appear issue brush page tag art opera awful';
const ROPSTEN_APIKEY = '8b3ae622294841069fab3197d413714f';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      // gas: 4000000,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/"+ROPSTEN_APIKEY)
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  }
};