const TestToken = artifacts.require("./mockContracts/TestToken.sol");
const FundWallet = artifacts.require("./FundWallet.sol");

const Helper = require("./helper.js");
const BigNumber = require('bignumber.js');
const truffleAssert = require('truffle-assertions');

let admin;
let backupAdmin;
let contributor1;
let contributor2;
let contributor3;
let reserve;
let outsideAcc;
let newAdmin;
let fundWalletInst;
let token;

const precisionUnits = (new BigNumber(10).pow(18));
const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const precision = new BigNumber(10).pow(18);
const nullAddress = '0x0000000000000000000000000000000000000000';

contract('FundWallet', function(accounts) {

  it("Should init Fund Wallet and test token", async function () {
      // set account addresses
      admin = accounts[0];
      backupAdmin = accounts[1];
      contributor1 = accounts[2];
      contributor2 = accounts[4];
      contributor3 = accounts[5];
      reserve = accounts[6];
      outsideAcc = accounts[7];
      newAdmin = accounts[8];

      //deploy fund wallet
      fundWalletInst = await FundWallet.new(admin, backupAdmin);

      //deploy token
      token = await TestToken.new("test", "tst", 18);
    });

    it("Should test time period failiures - prior to times being set", async function () {
      let corContAmount = 500;
      let adminStake = 1000;
      let adminCarry = 2000;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;
      let tokAmount = 10;
      let ethAmount = 10;

      //all the functions which should not be accessible at this stake in time should fail - the bellow calls are correct only times are wrong
      try {
        await fundWalletInst.setFundScheme(adminStake,adminCarry, {from: admin});
        assert(false, "throw was expected in line above.")
      }
      catch(e) {
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.setReserve(reserve, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.addContributor(contributor1, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.removeContributor(contributor3, {from:admin})
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminDeposit({from:admin, value:adminStake});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminRefund({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorRefund({from:contributor2});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawEther(etherWDAmt, admin, {from:admin});;
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawToken(token.address, tokenWDAmt, admin, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullToken(token.address, tokAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullEther(ethAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.logEndBal();
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminClaim({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorClaim({from:contributor1});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      let returnEthBal = await fundWalletInst.checkBalance(ethAddress);
      let returnTokBal = parseInt(await fundWalletInst.checkBalance(token.address));

      assert.equal(0, returnEthBal, "wrong balance");
      assert.equal(0, returnEthBal, "wrong balance");

    });

    it("Should set time periods (also checks failiures for this function)", async function () {
      //failed fund wallet set time periods -- non admin
      try {
          await fundWalletInst.setTimePeriods("60", "60", "60", "60", {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //success
      await fundWalletInst.setTimePeriods("60", "60", "60", "60", {from:admin});

      //should fail if trying to set time periods again
      try {
        await fundWalletInst.setTimePeriods("60", "60", "60", "60", {from:admin});
        assert(false, "throw was expected in line above.")
      }
      catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }
    });  

    it("Should test time period failiures - this is the admin period (adminP)", async function () {
      let corContAmount = 500;
      let adminStake = 1000;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;
      let tokAmount = 10;
      let ethAmount = 10;

      try {
          await fundWalletInst.adminDeposit({from:admin, value:adminStake});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminRefund({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorRefund({from:contributor2});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawEther(etherWDAmt, admin, {from:admin});;
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawToken(token.address, tokenWDAmt, admin, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullToken(token.address, tokAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullEther(ethAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.logEndBal();
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminClaim({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorClaim({from:contributor1});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      let returnEthBal = await fundWalletInst.checkBalance(ethAddress);
      let returnTokBal = parseInt(await fundWalletInst.checkBalance(token.address));

      assert.equal(0, returnEthBal, "wrong balance");
      assert.equal(0, returnEthBal, "wrong balance");

    });

    it("Should set fund scheme and check admin stake and performance fee is correct", async function () {
      let egAdminStake = 1000;
      let egAdminCarry = 2000;

      //set scheme call
      await fundWalletInst.setFundScheme(egAdminStake, egAdminCarry, {from:admin});

      //check that they are correct
      let carry = parseInt(await fundWalletInst.adminCarry.call());
      let stake = parseInt(await fundWalletInst.adminStake.call());
      assert.equal(egAdminStake, stake, "performance not init correctly")
    });

    it("Should set reserve and check failiures", async function () {

      //failed non admin reserve set
      try {
          await fundWalletInst.setReserve(reserve, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //correct call
      await fundWalletInst.setReserve(reserve, {from:admin});
    });

    it("Should add 3 contirbutors (and check failed contributor additions)", async function () {

      //failed add contributor - non admin
      try {
          await fundWalletInst.addContributor(contributor1, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //correct calls
      await fundWalletInst.addContributor(contributor1, {from:admin});
      await fundWalletInst.addContributor(contributor2, {from:admin});
      await fundWalletInst.addContributor(contributor3, {from:admin});

      let contributors = await fundWalletInst.getContributors();

      //check that contibutors ahve been correctly added
      assert.equal(contributors.length, 3, "unexpected number of contributors");
      assert.equal(contributors[0], contributor1, "contributor 1 is wrong");
      assert.equal(contributors[1], contributor2, "contributor 2 is wrong");
      assert.equal(contributors[2], contributor3, "contributor 3 is wrong");
    });

    it("Should remove a contributor (contributor3), and check failed remove contributor call", async function () {

      //failed remove contributor
      try {
          await fundWalletInst.removeContributor(contributor3, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //correct
      await fundWalletInst.removeContributor(contributor3, {from:admin});

      //cehck that contributors are correct
      let contributors = await fundWalletInst.getContributors();
      assert.equal(contributors.length, 2, "unexpected number of contributors");
      assert.equal(contributors[0], contributor1, "contributor 1 is wrong");
      assert.equal(contributors[1], contributor2, "contributor 2 is wrong");
    });

    it("Should skip time to raiseP and check failed admin deposits, then check balances", async function () {
      let incorAdminStake = 1100; //incorrect admin deposit
      let corAdminStake = 1000;

      //3650 - excess of 50secs to ensure we are comfortably in time period
      await Helper.advanceTimeAndBlock(3650);

      let balanceInit = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balanceInit, 0, "initial balance incorrect (not 0)")

      //fail as value != adminStake
      try {
          await fundWalletInst.adminDeposit({from:admin, value:incorAdminStake});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //fail msg.sender != admin
      try {
          await fundWalletInst.adminDeposit({from:outsideAcc, value:corAdminStake});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balances
      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, 0, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, 0, "incorrect balance")
    });

    it("Should accept deposit from admin in raiseP, then check balances", async function () {
      let adminStake = 1000; //correct admin deposit

      //correct call
      await fundWalletInst.adminDeposit({from:admin, value:adminStake});

      //check balances
      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, adminStake, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, adminStake, "incorrect balance")
    });

    it("Should check failed contributions in raiseP and check balances", async function () {
      let incorContAmount = 1100;
      let corContAmount = 500;

      let startBal = await Helper.getBalancePromise(fundWalletInst.address);
      let startRaisedBal = parseInt(await fundWalletInst.raisedBalance.call());

      //fail as msg.value > adminStake
      try {
          await fundWalletInst.contributorDeposit({from:contributor1, value:incorContAmount});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //fail as msg.sender != contributor1 or contributor2
      try {
          await fundWalletInst.contributorDeposit({from:outsideAcc, value:corContAmount});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //confirm that balances are correct
      let endBal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(startBal, endBal, "balances incorrect")

      let endRaisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(startRaisedBal, endRaisedBal, "incorrect balance")
    });

    it("Should accept contributions from contributors in raiseP and check balance", async function () {
      let corContAmount = 500;

      let startBal = await Helper.getBalancePromise(fundWalletInst.address);
      let startRaisedBal = parseInt(await fundWalletInst.raisedBalance.call());

      //correct conributor deposit call
      await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});

      //check that the balance is correct
      let expectedBal = await parseInt(startBal)+parseInt(corContAmount);
      let postC1Bal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(postC1Bal, expectedBal, "incorrect balance");
      let expectedRaisedBal = await startRaisedBal+corContAmount;
      let postC1RaisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(postC1RaisedBal, expectedRaisedBal, "incorrect balance");

      //correct conributor deposit call
      await fundWalletInst.contributorDeposit({from:contributor2, value:corContAmount});

      //check that the balance is correct
      expectedBal = await parseInt(postC1Bal)+parseInt(corContAmount);
      let postC2Bal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(postC2Bal, expectedBal, "incorrect balance")
      expectedRaisedBal = await postC1RaisedBal + corContAmount;
      let postC2RaisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(postC2RaisedBal, expectedRaisedBal, "incorrect balance");
    });

    it("Should test time period failiures - raiseP", async function () {
      let corContAmount = 500;
      let adminStake = 1000;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;
      let tokAmount = 10;
      let ethAmount = 10;

      try {
          await fundWalletInst.setReserve(reserve, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.addContributor(contributor1, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.removeContributor(contributor3, {from:admin})
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawEther(etherWDAmt, admin, {from:admin});;
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawToken(token.address, tokenWDAmt, admin, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullToken(token.address, tokAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullEther(ethAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.logEndBal();
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminClaim({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorClaim({from:contributor1});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      let returnEthBal = await fundWalletInst.checkBalance(ethAddress);
      let returnTokBal = parseInt(await fundWalletInst.checkBalance(token.address));

      assert.equal(0, returnEthBal, "wrong balance");
      assert.equal(0, returnEthBal, "wrong balance");
    });

    it("Should jump time to opperateP and test withdrawals, check balances", async function () {
      //3650 - excess of 50secs to ensure we are comfortable in time period
      await Helper.advanceTimeAndBlock(3650);
      let tokenInitBal = 100;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;

      //send tokens
      await token.transfer(fundWalletInst.address, tokenInitBal);
      let tokenBal = await token.balanceOf(fundWalletInst.address);
      assert.equal(tokenBal, tokenInitBal, "wrong balance");

      let etherBal = await Helper.getBalancePromise(fundWalletInst.address);

      //withdraw ether and check balacne is correct
      await fundWalletInst.withdrawEther(etherWDAmt, admin, {from:admin});

      let etherBal2 = await Helper.getBalancePromise(fundWalletInst.address);
      let expEthBal = await parseInt(etherBal) - parseInt(etherWDAmt);
      assert.equal(etherBal2, expEthBal, "incorrect balance");

      //withdraw token and check balacne is correct
      await fundWalletInst.withdrawToken(token.address, tokenWDAmt, admin, {from:admin});
      let tokenBal2 = await token.balanceOf(fundWalletInst.address);
      let expTokBal = await parseInt(tokenBal) - parseInt(tokenWDAmt);
      assert.equal(tokenBal2, expTokBal, "incorrect balance");
    });

    it("Should check failed withdrawals and check balances in opperateP", async function () {
      let tokenInitBal = 100;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;

      let startTokenBal = await token.balanceOf(fundWalletInst.address);

      let startEtherBal = await Helper.getBalancePromise(fundWalletInst.address);

      //failed withdraw non-admin
      try {
          await fundWalletInst.withdrawEther(etherWDAmt, admin, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawToken(token.address, tokenWDAmt, admin, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balances are correct
      let endEtherBal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(parseInt(startEtherBal), parseInt(endEtherBal), "incorrect balance");

      let endTokenBalance = await token.balanceOf(fundWalletInst.address);
      assert.equal(parseInt(startTokenBal), parseInt(endTokenBalance), "incorrect balance");
    });

    it("Should pull token in opperateP and check balances", async function () {
      let tokAmount = 10;

      let tokenBal = await token.balanceOf(fundWalletInst.address);

      //pull token call
      await fundWalletInst.pullToken(token.address, tokAmount, {from:reserve});

      //check balances
      let tokenBal2 = await token.balanceOf(fundWalletInst.address);
      let expTokBal = await parseInt(tokenBal) - parseInt(tokAmount);
      assert.equal(tokenBal2, expTokBal, "wrong balance");
    });

    it("Should test failed pull token in opperateP", async function () {
      let tokAmount = 10;

      let startTokenBal = await token.balanceOf(fundWalletInst.address);

      //failed pull token non-reserve
      try {
          await fundWalletInst.pullToken(token.address, tokAmount, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balances
      let endTokenBalance = await token.balanceOf(fundWalletInst.address);
      assert.equal(parseInt(startTokenBal), parseInt(endTokenBalance), "incorrect balance");
    });

    it("Should pull ether in opperateP and check balances", async function () {
      let ethAmount = 10;

      let etherBal = await Helper.getBalancePromise(fundWalletInst.address);

      //pull ether call
      await fundWalletInst.pullEther(ethAmount, {from:reserve});

      //check balance
      let etherBal2 = await Helper.getBalancePromise(fundWalletInst.address);
      let expEthBal = await parseInt(etherBal) - parseInt(ethAmount);
      assert.equal(etherBal2, expEthBal, "incorrect balance");
    });

    it("Should test failed pull ether in opperateP", async function () {
      let ethAmount = 10;

      let startEtherBal = await Helper.getBalancePromise(fundWalletInst.address);

      //failed pull ether non-reserve
      try {
          await fundWalletInst.pullEther(ethAmount, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balance
      let endEtherBal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(parseInt(startEtherBal), parseInt(endEtherBal), "incorrect balance");
    });

    it("Should check that checkBalance returns correct balances (both eth and token in opperateP)", async function () {

      let etherBal = await Helper.getBalancePromise(fundWalletInst.address);
      let tokenBal = parseInt(await token.balanceOf(fundWalletInst.address));

      //calls to check balance
      let returnEthBal = await fundWalletInst.checkBalance(ethAddress);
      let returnTokBal = parseInt(await fundWalletInst.checkBalance(token.address));

      //ennsure balance is correct
      assert.equal(etherBal, returnEthBal, "wrong balance");
      assert.equal(returnTokBal, tokenBal, "wrong balance");
    });

    it("Should test time period failiures - opperateP", async function () {
      let corContAmount = 500;
      let adminStake = 1000;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;
      let tokAmount = 10;
      let ethAmount = 10;

      try {
          await fundWalletInst.setReserve(reserve, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.addContributor(contributor1, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.removeContributor(contributor3, {from:admin})
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminDeposit({from:admin, value:adminStake});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminRefund({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorRefund({from:contributor2});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.logEndBal();
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminClaim({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorClaim({from:contributor1});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

    });

    it("Should jump time to liquidP and pull token in liquidP and check balances", async function () {
      let tokAmount = 10;
      //3650 - excess of 50 secs to ensure we are comfortably int ime period
      await Helper.advanceTimeAndBlock(3650);

      let tokenBal = await token.balanceOf(fundWalletInst.address);

      //pull token call
      await fundWalletInst.pullToken(token.address, tokAmount, {from:reserve});

      //check balances
      let tokenBal2 = await token.balanceOf(fundWalletInst.address);
      let expTokBal = await parseInt(tokenBal) - parseInt(tokAmount);
      assert.equal(tokenBal2, expTokBal, "wrong balance");
    });

    it("Should test failed pull token calls in liquidP", async function () {
      let tokAmount = 10;

      let startTokenBal = await token.balanceOf(fundWalletInst.address);;

      //failed pull token non-reserve
      try {
          await fundWalletInst.pullToken(token.address, tokAmount, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balances
      let endTokenBalance = await token.balanceOf(fundWalletInst.address);
      assert.equal(parseInt(startTokenBal), parseInt(endTokenBalance), "incorrect balance");
    });

    it("Should check that checkBalance returns correct balances (only token in liquidP as we want to get rid of tokens in liquidP)", async function () {

      let tokenBal = parseInt(await token.balanceOf(fundWalletInst.address));

      //calls
      let returnEthBal = await fundWalletInst.checkBalance(ethAddress);
      let returnTokBal = parseInt(await fundWalletInst.checkBalance(token.address));

      //check correct balances
      assert.equal(0, returnEthBal, "wrong balance");
      assert.equal(returnTokBal, tokenBal, "wrong balance");
    });

    it("Should test time period failiures - liquidP", async function () {

      let corContAmount = 500;
      let adminStake = 1000;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;
      let tokAmount = 10;
      let ethAmount = 10;

      try {
          await fundWalletInst.setReserve(reserve, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.addContributor(contributor1, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.removeContributor(contributor3, {from:admin})
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminDeposit({from:admin, value:adminStake});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminRefund({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorRefund({from:contributor2});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawEther(etherWDAmt, admin, {from:admin});;
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawToken(token.address, tokenWDAmt, admin, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullEther(ethAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.logEndBal();
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminClaim({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorClaim({from:contributor1});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

    });

    it("Should logEndBal", async function () {
      //3650 - additional 50secs to ensure we are in time period
      await Helper.advanceTimeAndBlock(3650);

      //call
      await fundWalletInst.logEndBal();

      //check that vlaues are correct
      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(loggedEndBal, parseInt(fwEndBal), "incorrect balance")
    });

    it("Should test failed claim admin stake", async function () {
      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //failed admin claim by non admin
      try {
          await fundWalletInst.adminClaim({from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balance
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(parseInt(fwStartBal), parseInt(fwEndBal), "incorrect balance");
    });

    it("Should claim admin's share and check balance", async function () {
      //init values for balance checks and payout calculation
      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let adminShare = parseInt(await fundWalletInst.stake.call(admin));
      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      let adminPayout = await ((adminShare/raisedBal)*loggedEndBal);

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //call
      await fundWalletInst.adminClaim({from:admin});

      //check that all the balances are correct
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, adminPayout, "wrong balance");
    });

    it("Should test failed admin RE-CLAIM of stake", async function () {
      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //failed admin claim when admin already claimed
      try {
          await fundWalletInst.adminClaim({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balances
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(parseInt(fwStartBal), parseInt(fwEndBal), "incorrect balance");
    });

    it("Should test failed claim contributor stake", async function () {
      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //failed contributor claim from a removed contributor
      try {
          await fundWalletInst.contributorClaim({from:contributor3});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //failed contributor claim from non-contributor
      try {
          await fundWalletInst.contributorClaim({from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balances
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(parseInt(fwStartBal), parseInt(fwEndBal), "incorrect balance");
    });

    it("Should claim C1's share and check balance", async function () {
      //init values for balance checks and payout calculation
      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let c1Share = parseInt(await fundWalletInst.stake.call(contributor1));
      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      let c1Payout = await ((c1Share/raisedBal)*loggedEndBal);

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //call
      await fundWalletInst.contributorClaim({from:contributor1});

      //check that balances are correct
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, c1Payout, "wrong balance");
    });

    it("Should test failed RE-CLAIM of contributor1's stake", async function () {
      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //failed contributor claim from a removed contributor
      try {
          await fundWalletInst.contributorClaim({from:contributor1});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //check balances
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(parseInt(fwStartBal), parseInt(fwEndBal), "incorrect balance");
    });

    it("Should claim C2's share and check balance", async function () {
      //init values for balance checks and payout calculation
      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let c2Share = parseInt(await fundWalletInst.stake.call(contributor2));
      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      let c2Payout = await ((c2Share/raisedBal)*loggedEndBal);

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //call
      await fundWalletInst.contributorClaim({from:contributor2});

      //check that balances are correct
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, c2Payout, "wrong balance");
    });

    it("Should test time period failiures - claimP", async function () {
      let corContAmount = 500;
      let adminStake = 1000;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;
      let tokAmount = 10;
      let ethAmount = 10;

      try {
          await fundWalletInst.setReserve(reserve, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.addContributor(contributor1, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.removeContributor(contributor3, {from:admin})
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminDeposit({from:admin, value:adminStake});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.adminRefund({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.contributorRefund({from:contributor2});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawEther(etherWDAmt, admin, {from:admin});;
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.withdrawToken(token.address, tokenWDAmt, admin, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullToken(token.address, tokAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          await fundWalletInst.pullEther(ethAmount, {from:reserve});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      let returnEthBal = await fundWalletInst.checkBalance(ethAddress);
      let returnTokBal = parseInt(await fundWalletInst.checkBalance(token.address));

      assert.equal(0, returnEthBal, "wrong balance");
      assert.equal(0, returnEthBal, "wrong balance");
    });

    it("Should test change admin (success and failiures)", async function () {

      //failed change admin - non backupAdmin
      try {
          await fundWalletInst.changeAdmin(newAdmin, {from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }
      try {
          await fundWalletInst.changeAdmin(newAdmin, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //successful call
      await fundWalletInst.changeAdmin(newAdmin, {from:backupAdmin});

      //check correct addresses have been set
      let adminAddr = await fundWalletInst.admin.call();

      assert.equal(adminAddr, newAdmin, "incorrect admin");
    });

    it("Should test failed init of Fund Wallet", async function () {
      //0 address failiures
      try {
          fundWalletInst = await FundWallet.new(nullAddress, backupAdmin);
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          fundWalletInst = await FundWallet.new(admin, nullAddress);
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          fundWalletInst = await FundWallet.new(nullAddress, nullAddress);
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

    });

});

contract('FundWallet - aborted fund', function(accounts) {

  it("Should init Fund Wallet and test token", async function () {
    // set account addresses
    admin = accounts[0];
    backupAdmin = accounts[1];
    contributor1 = accounts[2];
    contributor2 = accounts[4];
    contributor3 = accounts[5];
    reserve = accounts[6];
    outsideAcc = accounts[7];
    newAdmin = accounts[8];
    let egAdminStake = 1000;
    let egAdminCarry = 2000;
    let corContAmount = 500;

    //deploy fund wallet
    fundWalletInst = await FundWallet.new(admin, backupAdmin);

    //deploy token
    token = await TestToken.new("test", "tst", 18);

    //set times
    await fundWalletInst.setTimePeriods("60", "60", "60", "60", {from:admin});

    //set performance and admin stake
    await fundWalletInst.setFundScheme(egAdminStake, egAdminCarry, {from:admin});

    //set reserve
    await fundWalletInst.setReserve(reserve, {from:admin});

    //add contributors
    await fundWalletInst.addContributor(contributor1, {from:admin});
    await fundWalletInst.addContributor(contributor2, {from:admin});

    //jump to raiseP
    await Helper.advanceTimeAndBlock(3650);

    //admin deposit
    await fundWalletInst.adminDeposit({from:admin, value:egAdminStake});
  });

    it("Should remove contributor 1 on contributorRefund - even without deposit", async function () {
      let egAdminStake = 1000;
      //without deposit it acts as as an opt out for the contributor

      //test refund correct call
      await fundWalletInst.contributorRefund({from:contributor1});

      //check refund was correctly processed
      let contributors = await fundWalletInst.getContributors();
      assert.equal(contributors.length, 1, "unexpected number of contributors");
      assert.equal(contributors[0], contributor2, "contributors are incorrect");

      //check balance is correct
      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, egAdminStake, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, egAdminStake, "incorrect balance")

    });

    it("Should accept contribution from contributor 2 and then check adminRefund failiures", async function () {
      let egAdminStake = 1000;
      let corContAmount = 500;

      //accept contribution
      await fundWalletInst.contributorDeposit({from:contributor2, value:corContAmount});

      //admin tries redund - this will fail as the fund contains money from a contributor - there is another stakeholder
      try {
          await fundWalletInst.adminRefund({from:admin});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }
    });

    it("Should test contributorRefund and check balances", async function () {
      let egAdminStake = 1000;

      //contributor refund call
      await fundWalletInst.contributorRefund({from:contributor2});

      //check that correctly processed
      let contributors = await fundWalletInst.getContributors();
      assert.equal(contributors.length, 0, "unexpected number of contributors");

      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, egAdminStake, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, egAdminStake, "incorrect balance");
    });

    it("Should fail contributorRefund when already refunded", async function () {

      try {
          await fundWalletInst.contributorRefund({from:contributor2});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }
    });

    it("Should test adminRefund", async function () {

      //failed admin refund when non admin
      try {
          await fundWalletInst.adminRefund({from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      //admin refun and check correctly processed including balances
      await fundWalletInst.adminRefund({from:admin});
      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, 0, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, 0, "incorrect balance");
    });

})

contract('FundWallet - profitable scenario', function(accounts) {

  //20% performace fee for admin

  it("Should init Fund Wallet and test token", async function () {
    // set account addresses
    admin = accounts[0];
    backupAdmin = accounts[1];
    contributor1 = accounts[2];
    contributor2 = accounts[4];
    contributor3 = accounts[5];
    reserve = accounts[6];
    outsideAcc = accounts[7];
    newAdmin = accounts[8];
    let egAdminStake = 1000;
    let egAdminCarry = 2000;
    let corContAmount = 500;
    let profit = 1000;

    //deploy fund wallet
    fundWalletInst = await FundWallet.new(admin, backupAdmin);

    //deploy token
    token = await TestToken.new("test", "tst", 18);

    //set time periods
    await fundWalletInst.setTimePeriods("60", "60", "60", "60", {from:admin});

    //set admin stake and performance fee
    await fundWalletInst.setFundScheme(egAdminStake, egAdminCarry, {from:admin});

    //set reserve address
    await fundWalletInst.setReserve(reserve, {from:admin});

    //add contributors
    await fundWalletInst.addContributor(contributor1, {from:admin});
    await fundWalletInst.addContributor(contributor2, {from:admin});

    //jump to raiseP
    await Helper.advanceTimeAndBlock(3650);

    //admin deposit
    await fundWalletInst.adminDeposit({from:admin, value:egAdminStake});

    //contributor deposit
    await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});
    await fundWalletInst.contributorDeposit({from:contributor2, value:corContAmount});

    //jump to opperateP
    await Helper.advanceTimeAndBlock(3650);

    //send profit to fund wallet
    await Helper.sendEtherWithPromise(outsideAcc, fundWalletInst.address, profit);

    //jump to liquidP
    await Helper.advanceTimeAndBlock(3650);
    });

    it("Should log end balance and check balances", async function () {
      //jump to claim P
      await Helper.advanceTimeAndBlock(3650);

      //log end balance
      await fundWalletInst.logEndBal();

      //check that balances are correct
      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(loggedEndBal, parseInt(fwEndBal), "incorrect balance")
    });

    it("Should make admin claim and check balance", async function () {
      //init values to calculate payoff given 20% performace fee for admin
      let raisedBalance = parseInt(await fundWalletInst.raisedBalance.call());
      let endBal = parseInt(await fundWalletInst.endBalance.call());
      let adminStake = parseInt(await fundWalletInst.stake.call(admin));
      let profit = endBal - raisedBalance;
      let reward = profit*(0.2);
      let initialStake = 1000;
      let payoff = ((0.8*profit)*(adminStake/raisedBalance));
      let adminTtl = reward+initialStake+payoff;

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //admin claim
      await fundWalletInst.adminClaim({from:admin});

      //check that values/processing is correct
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, adminTtl, "wrong balance");
    });

    it("Should claim C1's share and check balance", async function () {
      //init values to calculate payoff given 20% performace fee for admin
      let raisedBalance = parseInt(await fundWalletInst.raisedBalance.call());
      let endBal = parseInt(await fundWalletInst.endBalance.call());
      let contStake = parseInt(await fundWalletInst.stake.call(contributor1));
      let profit = endBal - raisedBalance;
      let payoff = ((0.8*profit)*(contStake/raisedBalance));
      let contTtl = payoff+contStake;

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //contirbutor claim
      await fundWalletInst.contributorClaim({from:contributor1});

      //check that values/processing is correct
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, contTtl, "wrong balance");
    });

    it("Should claim C2's share and check balance", async function () {
      //init values to calculate payoff given 20% performace fee for admin
      let raisedBalance = parseInt(await fundWalletInst.raisedBalance.call());
      let endBal = parseInt(await fundWalletInst.endBalance.call());
      let contStake = parseInt(await fundWalletInst.stake.call(contributor2));
      let profit = endBal - raisedBalance;
      let payoff = ((0.8*profit)*(contStake/raisedBalance));
      let contTtl = payoff+contStake;

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);

      //contirbutor claim
      await fundWalletInst.contributorClaim({from:contributor2});

      //check that values/processing is correct
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, contTtl, "wrong balance");
    });

});
