//this test the main functionality of Fund Wallet - this also tests fund wallet in its loss scenario.
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

contract('FundWallet', function(accounts) {

  //need to have a test from time period failiures

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

      fundWalletInst = await FundWallet.new(admin, backupAdmin, {});

      token = await TestToken.new("test", "tst", 18);
    });

    it("Should test time period failiures - prior to times being set", async function () {

      let corContAmount = 500;
      let adminStake = 1000;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;
      let tokAmount = 10;
      let ethAmount = 10;
        //failed fund wallet set time periods -- non admin
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

    it("Should set time periods and check - adminP starts on init", async function () {
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
      });

    it("Should test time period failiures - adminP", async function () {

      let corContAmount = 500;
      let adminStake = 1000;
      let etherWDAmt = 10;
      let tokenWDAmt = 10;
      let tokAmount = 10;
      let ethAmount = 10;
        //failed fund wallet set time periods -- non admin
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

      await fundWalletInst.setFundScheme(egAdminStake, egAdminCarry, {from:admin});

      let carry = parseInt(await fundWalletInst.adminCarry.call());
      let stake = parseInt(await fundWalletInst.adminStake.call());
      assert.equal(egAdminStake, stake, "performance not init correctly")
      });

    it("Should set reserve", async function () {

      //failed non admin reserve set
      try {
          await fundWalletInst.setReserve(reserve, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      await fundWalletInst.setReserve(reserve, {from:admin});
    });

    it("Should add 3 contirbutors", async function () {

      //failed add contributor
      try {
          await fundWalletInst.addContributor(contributor1, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      await fundWalletInst.addContributor(contributor1, {from:admin});
      await fundWalletInst.addContributor(contributor2, {from:admin});
      await fundWalletInst.addContributor(contributor3, {from:admin});

      let contributors = await fundWalletInst.getContributors();

      assert.equal(contributors.length, 3, "unexpected number of contributors");
      assert.equal(contributors[0], contributor1, "contributor 1 is wrong");
      assert.equal(contributors[1], contributor2, "contributor 2 is wrong");
      assert.equal(contributors[2], contributor3, "contributor 3 is wrong");
    });

    it("Should remove a contributor (contributor3)", async function () {

      //failed remove contributor
      try {
          await fundWalletInst.removeContributor(contributor3, {from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      await fundWalletInst.removeContributor(contributor3, {from:admin});

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

      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, 0, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, 0, "incorrect balance")
    });

    it("Should accept deposit from admin, then check balances", async function () {
      let adminStake = 1000; //correct admin deposit

      await fundWalletInst.adminDeposit({from:admin, value:adminStake});

      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, adminStake, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, adminStake, "incorrect balance")
    });

    it("Should check failed contributions and check balances", async function () {
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

      let endBal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(startBal, endBal, "balances incorrect")

      let endRaisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(startRaisedBal, endRaisedBal, "incorrect balance")
    });

    it("Should accept contributions from contributors and check balance", async function () {
      let corContAmount = 500;

      let startBal = await Helper.getBalancePromise(fundWalletInst.address);
      let startRaisedBal = parseInt(await fundWalletInst.raisedBalance.call());

      await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});

      let expectedBal = await parseInt(startBal)+parseInt(corContAmount);
      let postC1Bal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(postC1Bal, expectedBal, "incorrect balance");
      let expectedRaisedBal = await startRaisedBal+corContAmount;
      let postC1RaisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(postC1RaisedBal, expectedRaisedBal, "incorrect balance");

      await fundWalletInst.contributorDeposit({from:contributor2, value:corContAmount});

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
        //failed fund wallet set time periods -- non admin
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

      await token.transfer(fundWalletInst.address, tokenInitBal);
      let tokenBal = await token.balanceOf(fundWalletInst.address);
      assert.equal(tokenBal, tokenInitBal, "wrong balance");

      let etherBal = await Helper.getBalancePromise(fundWalletInst.address);

      //withdraw ether
      await fundWalletInst.withdrawEther(etherWDAmt, admin, {from:admin});

      let etherBal2 = await Helper.getBalancePromise(fundWalletInst.address);
      let expEthBal = await parseInt(etherBal) - parseInt(etherWDAmt);
      assert.equal(etherBal2, expEthBal, "incorrect balance");

      //withdraw token
      await fundWalletInst.withdrawToken(token.address, tokenWDAmt, admin, {from:admin});
      let tokenBal2 = await token.balanceOf(fundWalletInst.address);
      let expTokBal = await parseInt(tokenBal) - parseInt(tokenWDAmt);
      assert.equal(tokenBal2, expTokBal, "incorrect balance");
    });

    it("Should check failed withdrawals and check balances", async function () {
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

      let endEtherBal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(parseInt(startEtherBal), parseInt(endEtherBal), "incorrect balance");

      let endTokenBalance = await token.balanceOf(fundWalletInst.address);
      assert.equal(parseInt(startTokenBal), parseInt(endTokenBalance), "incorrect balance");
    });

    it("Should pull token (successful in opperateP) and check balances", async function () {
      let tokAmount = 10;

      let tokenBal = await token.balanceOf(fundWalletInst.address);

      await fundWalletInst.pullToken(token.address, tokAmount, {from:reserve});

      let tokenBal2 = await token.balanceOf(fundWalletInst.address);
      let expTokBal = await parseInt(tokenBal) - parseInt(tokAmount);
      assert.equal(tokenBal2, expTokBal, "wrong balance");
    });

    it("Should test failed pull token", async function () {
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

      let endTokenBalance = await token.balanceOf(fundWalletInst.address);
      assert.equal(parseInt(startTokenBal), parseInt(endTokenBalance), "incorrect balance");
    });

    it("Should pull ether (successful in opperateP) and check balances", async function () {
      let ethAmount = 10;

      let etherBal = await Helper.getBalancePromise(fundWalletInst.address);

      await fundWalletInst.pullEther(ethAmount, {from:reserve});

      let etherBal2 = await Helper.getBalancePromise(fundWalletInst.address);
      let expEthBal = await parseInt(etherBal) - parseInt(ethAmount);
      assert.equal(etherBal2, expEthBal, "incorrect balance");
    });

    it("Should test failed pull ether", async function () {
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

      let endEtherBal = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(parseInt(startEtherBal), parseInt(endEtherBal), "incorrect balance");
    });

    it("Should check that checkBalance returns correct balances (both eth and token in opperateP)", async function () {

      let etherBal = await Helper.getBalancePromise(fundWalletInst.address);
      let tokenBal = parseInt(await token.balanceOf(fundWalletInst.address));

      let returnEthBal = await fundWalletInst.checkBalance(ethAddress);
      let returnTokBal = parseInt(await fundWalletInst.checkBalance(token.address));

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
        //failed fund wallet set time periods -- non admin
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

    it("Should jump time to liquidP and pull token (successful in liquidP) and check balances", async function () {
      let tokAmount = 10;

      await Helper.advanceTimeAndBlock(3650);

      let tokenBal = await token.balanceOf(fundWalletInst.address);

      await fundWalletInst.pullToken(token.address, tokAmount, {from:reserve});

      let tokenBal2 = await token.balanceOf(fundWalletInst.address);
      let expTokBal = await parseInt(tokenBal) - parseInt(tokAmount);
      assert.equal(tokenBal2, expTokBal, "wrong balance");
    });

    it("Should test failed pull token", async function () {
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

      let endTokenBalance = await token.balanceOf(fundWalletInst.address);
      assert.equal(parseInt(startTokenBal), parseInt(endTokenBalance), "incorrect balance");
    });

    it("Should check that checkBalance returns correct balances (token in liquidP)", async function () {

      let tokenBal = parseInt(await token.balanceOf(fundWalletInst.address));

      let returnEthBal = await fundWalletInst.checkBalance(ethAddress);
      let returnTokBal = parseInt(await fundWalletInst.checkBalance(token.address));

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
        //failed fund wallet set time periods -- non admin
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
      await Helper.advanceTimeAndBlock(3650);

      await fundWalletInst.logEndBal();

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

      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(parseInt(fwStartBal), parseInt(fwEndBal), "incorrect balance");
    });

    it("Should claim admin's share and check balance", async function () {
      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let adminShare = parseInt(await fundWalletInst.stake.call(admin));
      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      let adminPayout = await ((adminShare/raisedBal)*loggedEndBal);

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);
      await fundWalletInst.adminClaim({from:admin});
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

      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(parseInt(fwStartBal), parseInt(fwEndBal), "incorrect balance");
    });

    it("Should claim C1's share and check balance", async function () {
      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let c1Share = parseInt(await fundWalletInst.stake.call(contributor1));
      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      let c1Payout = await ((c1Share/raisedBal)*loggedEndBal);

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);
      await fundWalletInst.contributorClaim({from:contributor1});
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

      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(parseInt(fwStartBal), parseInt(fwEndBal), "incorrect balance");
    });

    it("Should claim C2's share and check balance", async function () {
      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let c2Share = parseInt(await fundWalletInst.stake.call(contributor2));
      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      let c2Payout = await ((c2Share/raisedBal)*loggedEndBal);

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);
      await fundWalletInst.contributorClaim({from:contributor2});
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
        //failed fund wallet set time periods -- non admin
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

      await fundWalletInst.changeAdmin(newAdmin, {from:backupAdmin});

      let adminAddr = await fundWalletInst.admin.call();

      assert.equal(adminAddr, newAdmin, "incorrect admin");
    });

    it("Should test failed init of Fund Wallet", async function () {

      try {
          fundWalletInst = await FundWallet.new(0, backupAdmin, {});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          fundWalletInst = await FundWallet.new(admin, 0, {});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      try {
          fundWalletInst = await FundWallet.new(0, 0, {});
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

      fundWalletInst = await FundWallet.new(admin, backupAdmin, {});

      token = await TestToken.new("test", "tst", 18);

      //success
      await fundWalletInst.setTimePeriods("60", "60", "60", "60", {from:admin});

      await fundWalletInst.setFundScheme(egAdminStake, egAdminCarry, {from:admin});

      await fundWalletInst.setReserve(reserve, {from:admin});

      await fundWalletInst.addContributor(contributor1, {from:admin});
      await fundWalletInst.addContributor(contributor2, {from:admin});

      await Helper.advanceTimeAndBlock(3650);

      await fundWalletInst.adminDeposit({from:admin, value:egAdminStake});
    });

    it("Should remove contributor 1 on contributorRefund - even without deposit", async function () {
      let egAdminStake = 1000;

      await fundWalletInst.contributorRefund({from:contributor1});

      let contributors = await fundWalletInst.getContributors();
      assert.equal(contributors.length, 1, "unexpected number of contributors");
      assert.equal(contributors[0], contributor2, "contributors are incorrect");

      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, egAdminStake, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, egAdminStake, "incorrect balance")

    });

    it("Should accept contribution from contributor 2 and then check adminRefund failiures", async function () {
      let egAdminStake = 1000;
      let corContAmount = 500;

      await fundWalletInst.contributorDeposit({from:contributor2, value:corContAmount});

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

      await fundWalletInst.contributorRefund({from:contributor2});

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

      try {
          await fundWalletInst.adminRefund({from:outsideAcc});
          assert(false, "throw was expected in line above.")
      }
      catch(e){
          assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
      }

      await fundWalletInst.adminRefund({from:admin});
      let balance = await Helper.getBalancePromise(fundWalletInst.address);
      assert.equal(balance, 0, "incorrect balance")

      let raisedBal = parseInt(await fundWalletInst.raisedBalance.call());
      assert.equal(raisedBal, 0, "incorrect balance");
    });

})

contract('FundWallet - profitable scenario', function(accounts) {

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

      fundWalletInst = await FundWallet.new(admin, backupAdmin, {});

      token = await TestToken.new("test", "tst", 18);

      //success
      await fundWalletInst.setTimePeriods("60", "60", "60", "60", {from:admin});

      await fundWalletInst.setFundScheme(egAdminStake, egAdminCarry, {from:admin});

      await fundWalletInst.setReserve(reserve, {from:admin});

      await fundWalletInst.addContributor(contributor1, {from:admin});
      await fundWalletInst.addContributor(contributor2, {from:admin});

      await Helper.advanceTimeAndBlock(3650);

      await fundWalletInst.adminDeposit({from:admin, value:egAdminStake});

      await fundWalletInst.contributorDeposit({from:contributor1, value:corContAmount});
      await fundWalletInst.contributorDeposit({from:contributor2, value:corContAmount});

      await Helper.advanceTimeAndBlock(3650);

      await Helper.sendEtherWithPromise(outsideAcc, fundWalletInst.address, profit);

      await Helper.advanceTimeAndBlock(3650);
    });

    it("Should log end balance and check balances", async function () {
      await Helper.advanceTimeAndBlock(3650);
      await fundWalletInst.logEndBal();

      let loggedEndBal = parseInt(await fundWalletInst.endBalance.call());
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);

      assert.equal(loggedEndBal, parseInt(fwEndBal), "incorrect balance")
    });

    it("Should make admin claim and check balance", async function () {
      let raisedBalance = parseInt(await fundWalletInst.raisedBalance.call());
      let endBal = parseInt(await fundWalletInst.endBalance.call());
      let adminStake = parseInt(await fundWalletInst.stake.call(admin));
      let profit = endBal - raisedBalance;
      let reward = profit*(0.2);
      let initialStake = 1000;
      let payoff = ((0.8*profit)*(adminStake/raisedBalance));
      let adminTtl = reward+initialStake+payoff;

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);
      await fundWalletInst.adminClaim({from:admin});
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, adminTtl, "wrong balance");
    });

    it("Should claim C1's share and check balance", async function () {
      let raisedBalance = parseInt(await fundWalletInst.raisedBalance.call());
      let endBal = parseInt(await fundWalletInst.endBalance.call());
      let contStake = parseInt(await fundWalletInst.stake.call(contributor1));
      let profit = endBal - raisedBalance;
      let payoff = ((0.8*profit)*(contStake/raisedBalance));
      let contTtl = payoff+contStake;

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);
      await fundWalletInst.contributorClaim({from:contributor1});
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, contTtl, "wrong balance");
    });

    it("Should claim C2's share and check balance", async function () {
      let raisedBalance = parseInt(await fundWalletInst.raisedBalance.call());
      let endBal = parseInt(await fundWalletInst.endBalance.call());
      let contStake = parseInt(await fundWalletInst.stake.call(contributor2));
      let profit = endBal - raisedBalance;
      let payoff = ((0.8*profit)*(contStake/raisedBalance));
      let contTtl = payoff+contStake;

      let fwStartBal = await Helper.getBalancePromise(fundWalletInst.address);
      await fundWalletInst.contributorClaim({from:contributor2});
      let fwEndBal = await Helper.getBalancePromise(fundWalletInst.address);
      let fwChangeBal = parseInt(fwStartBal) - parseInt(fwEndBal);
      assert.equal(fwChangeBal, contTtl, "wrong balance");
    });

});
