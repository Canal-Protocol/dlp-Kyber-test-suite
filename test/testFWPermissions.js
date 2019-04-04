const TestFWPerm = artifacts.require("./mockContracts/TestFWPermissions.sol");

const Helper = require("./helper.js");
const BigNumber = require('bignumber.js');
const truffleAssert = require('truffle-assertions');

let admin;
let backupAdmin;
let contributor;
let reserve;
let outsideAcc;

//instance of contract
let testFWPermInst

const precisionUnits = (new BigNumber(10).pow(18));
const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const precision = new BigNumber(10).pow(18);

contract('Test FundWallet Permissions/Modifiers', function(accounts) {

  it("Should init Fund Wallet and test token", async function () {
      // set account addresses
      admin = accounts[0];
      backupAdmin = accounts[1];
      contributor = accounts[2];
      reserve = accounts[3];
      outsideAcc = accounts[4];

      //deploy TestFWPermissions contract
      testFWPermInst = await TestFWPerm.new(admin, backupAdmin, reserve, contributor, {});

    });

  it("Should test the onlyAdmin modifier", async function() {
    //correct call
    await testFWPermInst.testOnlyAdmin({from:admin});

    //failing scenario
    try {
        await testFWPermInst.testOnlyAdmin({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the onlyBackupAdmin modifier", async function() {
    //correct call
    await testFWPermInst.testOnlyBackupAdmin({from:backupAdmin});

    //failing scenario
    try {
        await testFWPermInst.testOnlyBackupAdmin({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the timePeriodsNotSet modifier", async function() {
    //correct call
    await testFWPermInst.testTimePeriodsNotSet({from:outsideAcc});

    //failing scenario is opposite - time periods set
    try {
        await testFWPermInst.testTimePeriodsAreSet({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the onlyReserve modifier", async function() {
    //correct call
    await testFWPermInst.testOnlyReserve({from:reserve});

    //failing scenario
    try {
        await testFWPermInst.testOnlyReserve({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the onlyContributor modifier", async function() {
    //correct call
    await testFWPermInst.testOnlyContributor({from:contributor});

    //failing scenario
    try {
        await testFWPermInst.testOnlyContributor({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the timePeriodsAreSet modifier", async function() {
    //change state to set time periods
    await testFWPermInst.setTimePeriods("60", "60", "60", "60", {from: outsideAcc});

    //correct call
    await testFWPermInst.testTimePeriodsAreSet({from:outsideAcc});

    //failing scenario is opposite - time periods not set
    try {
        await testFWPermInst.testTimePeriodsNotSet({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the adminHasNotStaked modifier", async function() {
    //correct call
    await testFWPermInst.testAdminHasNotStaked({from:outsideAcc});

    //failing scenario is opposite - admin has staked
    try {
        await testFWPermInst.testAdminHasStaked({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the adminHasStaked modifier", async function() {
    //change state to set admin has staked
    await testFWPermInst.adminStake({from: outsideAcc});

    //correct call
    await testFWPermInst.testAdminHasStaked({from:outsideAcc});

    //failing scenario is opposite - admin has not staked
    try {
        await testFWPermInst.testAdminHasNotStaked({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the endBalanceNotLogged modifier", async function() {
    //correct call
    await testFWPermInst.testEndBalanceNotLogged({from:outsideAcc});

    //failing scenario is opposite - end balance logged
    try {
        await testFWPermInst.testEndBalanceIsLogged({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the endBalanceIsLogged modifier", async function() {
    //change state to set admin has staked
    await testFWPermInst.logEndBal({from: outsideAcc});

    //correct call
    await testFWPermInst.testEndBalanceIsLogged({from:outsideAcc});

    //failing scenario is opposite - end balance is not logged
    try {
        await testFWPermInst.testEndBalanceNotLogged({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the hasNotClaimed modifier", async function() {
    //correct call
    await testFWPermInst.testHasNotClaimed({from:contributor});

    //change state for failed scenario bellow
    await testFWPermInst.claim({from:contributor});

    //failing scenario is where they have claimed and re-try modifier
    try {
        await testFWPermInst.testHasNotClaimed({from:contributor});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the inAdminP modifier", async function() {
    //correct call
    await testFWPermInst.testInAdminP({from:outsideAcc});

    //failing scenario is other time periods
    try {
        await testFWPermInst.testInRaiseP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInOpperateP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInOpAndLiqP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInLiquidP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInClaimP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the inRaiseP modifier", async function() {
    //jump time - 3650secs - excess of 50secs to ensure we are comfortably in time period
    await Helper.advanceTimeAndBlock(3650);

    //correct call
    await testFWPermInst.testInRaiseP({from:outsideAcc});

    //failing scenario is other time periods
    try {
        await testFWPermInst.testInAdminP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInOpperateP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInOpAndLiqP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInLiquidP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInClaimP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the inOpperateP and inOpAndLiqP modifier", async function() {
    //jump time - 3650secs - excess of 50secs to ensure we are comfortably in time period
    await Helper.advanceTimeAndBlock(3650);

    //correct calls
    await testFWPermInst.testInOpperateP({from:outsideAcc});

    await testFWPermInst.testInOpAndLiqP({from:outsideAcc});

    //failing scenario is other time periods
    try {
        await testFWPermInst.testInAdminP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInRaiseP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInLiquidP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInClaimP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the inLiquidP and inOpAndLiqP modifier", async function() {
    //jump time - 3650secs - excess of 50secs to ensure we are comfortably in time period
    await Helper.advanceTimeAndBlock(3650);

    //correct calls
    await testFWPermInst.testInLiquidP({from:outsideAcc});

    await testFWPermInst.testInOpAndLiqP({from:outsideAcc});

    //failing scenario is other time periods
    try {
        await testFWPermInst.testInAdminP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInRaiseP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInOpperateP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInClaimP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

  it("Should test the inClaimP modifier", async function() {
    //jump time - 3650secs - excess of 50secs to ensure we are comfortably in time period
    await Helper.advanceTimeAndBlock(3650);

    //correct call
    await testFWPermInst.testInClaimP({from:outsideAcc});

    //failing scenario is other time periods
    try {
        await testFWPermInst.testInAdminP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInRaiseP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInOpperateP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInOpAndLiqP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }

    try {
        await testFWPermInst.testInLiquidP({from:outsideAcc});
        assert(false, "throw was expected in line above.")
    }
    catch(e){
        assert(Helper.isRevertErrorMessage(e), "expected throw but got: " + e);
    }
  })

});
