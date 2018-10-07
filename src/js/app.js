var App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("/CryptoHackers.json", function(cryptoHackers) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.CryptoHackers = TruffleContract(cryptoHackers);
      // Connect provider to interact with contract
      App.contracts.CryptoHackers.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var cryptoHackerInstance;

    function getRandomInt() {
      return Math.floor(Math.random() * (9007199254740991 + 9007199254740991 + 1)) - 9007199254740991;
  }

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.CryptoHackers.deployed().then(function(instance) {
      cryptoHackerInstance = instance;
      return cryptoHackerInstance.hello();
    }).then(function(result) {
      var printHello = $("#hellohacker");
      printHello.html(result);
    }).catch(function(error) {
      console.warn(error);
    });

    // Callback for creating a hacker
    $("#hacker-form").submit(function( event ) {
      let name = event.target.name.value.trim().toLowerCase(),
          gender = event.target.name.value.trim().toLowerCase();
      cryptoHackerInstance.createRandomHacker(name, gender).then(function(result)  {
        var avatar = new Avatars(Avatars.sprites.male);
        //var svg = avatars.create('')
        console.log(result)
      }).catch(function(error) {
        console.warn(error);
      })
      event.preventDefault();
    
    });

    // App.contracts.CryptoHackers.deployed().then(function(instance) {
    //   cryptoHackerInstance = instance;
    //   console.log("working")
    //   return cryptoHackerInstance
    // }).then(function(result) {
    //   var printHello = $("#hellohacker");
    //   printHello.html(result);
    // }).catch(function(error) {
    //   console.warn(error);
    // });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
