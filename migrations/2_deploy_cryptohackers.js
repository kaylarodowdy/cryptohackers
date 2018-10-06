var CryptoHackers = artifacts.require("./CryptoHackers.sol");

module.exports = function(deployer){
    deployer.deploy(CryptoHackers);
}