var App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hackerId: null,

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
      App.listenForHackerCreateEvent();
      App.listenForLearnNewSkillEvent();
      return App.render();
    });
  },

  hasPalyerHacker: function() {

    console.log("hasPalyerHacker");
    let cryptoHackerInstance;
    

    App.contracts.CryptoHackers.deployed().then(function(instance) {
      cryptoHackerInstance = instance;
      return cryptoHackerInstance.getOwnedTokens();
    }).then(function(myHackers) {
      if(myHackers.length == 0) {
        $("#create-crypto-hacker-container").show();
        $("#player-profile").hide();
      } else {
        $("#player-profile").show();
        $("#create-crypto-hacker-container").hide();
        App.hackerId = myHackers[0].toNumber();
        cryptoHackerInstance.hackers(App.hackerId).then(function(hacker){
          console.log("Hacker ");
          console.log(hacker);
        }); 

        cryptoHackerInstance.getHackerSkills(App.hackerId).then(function(skills){
          console.log("Skills ");
          console.log(skills);
        }); 
      }
    }).catch(function(error) {
      console.warn(error);
    });  
  },

  listenForHackerCreateEvent: function() {
    App.contracts.CryptoHackers.deployed().then(function(instance){
      instance.hackerCreatedEvent({}, {
        fromBlock: 'latest',
        toBlock: 'latest'
      }).watch(function(error, event){
        console.log("event triggered & hacker ID", event.args._hackerId.toNumber());
        App.hackerId = event.args._hackerId.toNumber();
        //add toast
        App.render();
      });
    });
  },

  listenForLearnNewSkillEvent: function() {
    let cryptoHackerInstance;
    App.contracts.CryptoHackers.deployed().then(function(instance){
      cryptoHackerInstance = instance;
      instance.learnNewSkillEvent({}, {
        fromBlock: 'latest',
        toBlock: 'latest'
      }).watch(function(error, event){
        console.log("new skill event triggered & hacker ID", event.args._hackerId.toNumber());
        App.hackerId = event.args._hackerId.toNumber();

        //add toast
        App.render();
      });
    });
  },

  render: function() {
    let cryptoHackerInstance;
    App.hasPalyerHacker();

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

  //   console.log(result)
  //   $("#hacker-form").hide()
  //   $("#dynamic-form").show()
  //   $("#hacker-img").src = `http://avatars.dicebear.com/v2/${gender}/${Math.random()*312321}.svg`;
    
  // }).catch(function(error) {
  //   console.log(error)
  //   $("#hacker-form").hide()
  //   $("#dynamic-form").show()
  //   $("#hacker-img").src = `http://avatars.dicebear.com/v2/${gender}/${Math.random()*312321}.svg`;

    // Callback for creating a hacker
    $("#hacker-form").submit(function( event ) {
      let name = $("#name").val();
      let gender = $("#gender").val();
      if(gender === "any") {
        gender = "male";
      }

      cryptoHackerInstance.createRandomHacker(name, gender).then(function(receipt)  {
        
      }).catch(function(error) {
        console.warn(error);
      })

      // cryptoHackerInstance.createRandomHacker(name, gender).then(function(receipt)  {
      //   return cryptoHackerInstance.getOwnedTokens();
      // }).then(function(myHackers) {
      //   App.hackerId = myHackers[(myHackers.length - 1)].toNumber();
      //   console.log(myHackers);
      //   // App.hackerId = myHackers[(myHackers.length - 1)].toNumber();
      //   return cryptoHackerInstance.hackers(App.hackerId);
      // }).then(function(_hacker){
      //   // var avatar = new Avatars(Avatars.sprites[gender]);
      //   // var svg = avatar.create(_hacker[0].toNumber());
      //   $("#player-profile").show();
      //   // $("#player-profile").append(_hacker[0].toNumber());
      //   $("#create-crypto-hacker-container").hide();
      // })
      // .catch(function(error) {
      //   console.warn(error);
      // })

      event.preventDefault();
    });


    $("#java").click(function( event ) {
      console.log('java'+ App.hackerId);

      if(App.hackerId > -1) {
        App.contracts.CryptoHackers.deployed().then(function(instance) {
          cryptoHackerInstance = instance;
          return cryptoHackerInstance.learnNewSkill(App.hackerId, 100);
        }).then(function(result) {
          console.log("Result");
          console.log(result);
        }).catch(function(error) {
          console.warn(error);
        });
      } else {
        console.log("No Hacker ID");
      }
    });

    $("#nodejs").click(function( event ) {
      console.log('nodejs'+ App.hackerId);
      if(App.hackerId > -1) {
        App.contracts.CryptoHackers.deployed().then(function(instance) {
          cryptoHackerInstance = instance;
          return cryptoHackerInstance.learnNewSkill(App.hackerId, 200);
        }).then(function(result) {
          console.log("Result");
          console.log(result);
        }).catch(function(error) {
          console.warn(error);
        });
      } else {
        console.log("No Hacker ID");
      }
    });

    $("#python").click(function( event ) {
      console.log('python'+ App.hackerId);
      if(App.hackerId > -1) {
        App.contracts.CryptoHackers.deployed().then(function(instance) {
          cryptoHackerInstance = instance;
          return cryptoHackerInstance.learnNewSkill(App.hackerId, 300);
        }).then(function(result) {
          console.log("Result");
          console.log(result);
        }).catch(function(error) {
          console.warn(error);
        });
      } else {
        console.log("No Hacker ID");
      }
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
