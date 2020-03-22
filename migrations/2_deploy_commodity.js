const ContactBookDAPP = artifacts.require("ContactBookDAPP");

module.exports = function(deployer) {
  deployer.deploy(ContactBookDAPP);
};
