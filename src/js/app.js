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

    function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        xhr = null;
      }
      return xhr;
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
        return cryptoHackerInstance.getOwnedTokens();
      }).then(function(myHackers){
        return cryptoHackerInstance.hackers(myHackers[(myHackers.length - 1)].toNumber());
      }).then(function(_hacker){
        console.log(_hacker)
        $("#hacker-form").hide()
        $("#dynamic-form").show()
        $("#form-title").html( "Something else")
        dna  = _hacker[0].toNumber()
        name = _hacker[1]
        gender =  _hacker[2]
        level = _hacker[3]
        exp = _hacker[4]
        $("#hacker-img").attr("src",`https://avatars.dicebear.com/v2/${gender}/${dna}.svg`);

        // $.ajax(
        //   {
        //       url: "https://avatars.dicebear.com/v2/male/12312.svg" ,
        //       dataType: 'html',
        //       crossDomain: true,
        //       type: 'GET',
        //       success: function(data) 
        //       {         
        //         $("#hacker-img").prepend(data);
        //         console.log(data, _hacker)
        //       }
        //   });
      })
      .catch(function(error) {
        alert(error)
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
