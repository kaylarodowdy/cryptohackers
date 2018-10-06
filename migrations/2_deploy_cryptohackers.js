var CryptoHackers = artifacts.require("./CryptoHackers.sol");

module.exports = async function(deployer){
    await deployer.deploy(CryptoHackers, "CryptoHackerToken", "HACK");
    deployer.deploy(CryptoHackers);
}