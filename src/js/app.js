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
    $.getJSON("CryptoHackers.json", function(cryptoHackers) {
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
          $("#dna-temp").text(hacker[0].toNumber());
          $("#name-temp").text(hacker[1]);
          $("#gender-temp").text(hacker[2]);
          $("#lvl-temp").text(hacker[3].toNumber());
          $("#exp-temp").text(hacker[4].toNumber()+"/20");
          $("#hacker-img").attr("src",`https://avatars.dicebear.com/v2/${hacker[2]}/${hacker[0].toNumber()}.svg`);
          $("#hacker-img-1").attr("src",`https://avatars.dicebear.com/v2/${hacker[2]}/${hacker[0].toNumber()}.svg`);
          $("#hacker-img-2").attr("src",`img/sample.svg`);
        }); 

        cryptoHackerInstance.getHackerSkills(App.hackerId).then(function(skills){
          console.log("Skills ");
          console.log(skills);
          let i;
          let skillsTemplate = "<p>"; 
          for (i = 0; i < skills.length; i++) { 
              // text += cars[i] + "<br>";
              console.log(skills[i].toNumber());
              switch (skills[i].toNumber()) {
                case 100:
                  skillsTemplate += "java ";
                  break; 
                case 200:
                  skillsTemplate += "nodejs ";
                  break;
                case 300:
                  skillsTemplate += "python ";
                  break;
              }
          }
          skillsTemplate += "</p>";
          
          $("#skills-temp").html(skillsTemplate);
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