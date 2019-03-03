/* global artifacts */
/* eslint-disable no-unused-vars */
const ConversionRates = artifacts.require('./ConversionRates.sol');
const SanityRates = artifacts.require('./SanityRates.sol');
const FundWallet = artifacts.require('./FundWallet.sol');
const FundReserve = artifacts.require('./KyberFundReserve.sol');
const MockFundWallet = artifacts.require('./mockContracts/MockFundWallet.sol');
const TestToken = artifacts.require('./mockContracts/TestToken.sol');


module.exports = async (deployer, network, accounts) => {
  const admin = accounts[0];
  const backupAdmin = accounts[1];

  // Deploy the contracts
  await deployer.deploy(ConversionRates, admin);
  await deployer.deploy(FundWallet, admin, backupAdmin);
  await deployer.deploy(SanityRates, admin);
  await deployer.deploy(FundReserve, SanityRates.address, ConversionRates.address, FundWallet.address, admin);

  await deployer.deploy(MockFundWallet, "60", "60", "60", "60");
  await deployer.deploy(TestToken, "test", "tst", "18");
};
