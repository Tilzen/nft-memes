const Migrations = artifacts.require("Meme")

module.exports = function (deployer) {
  deployer.deploy(Migrations)
}