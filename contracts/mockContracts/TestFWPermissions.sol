pragma solidity 0.4.18;

import "../FwPermissions.sol";

contract TestFWPermissions is FwPermissions {

    //for testing functions with modifiers
    uint public counter;

    // functions to switch states for different modifiers
    function TestFWPermissions(address _admin, address _backupAdmin, address _reserve, address _contributor) public {
        admin = _admin;
        backupAdmin = _backupAdmin;
        reserve = _reserve;
        isContributor[ _contributor] = true;
        contributors.push( _contributor);
        counter = 0;
    }

    function setTimePeriods(uint _adminP, uint _raiseP, uint _opperateP, uint _liquidP) public {
        start = now;
        adminP = _adminP * (60 seconds);
        raiseP = _raiseP * (60 seconds);
        opperateP = _opperateP * (60 seconds);
        liquidP = _liquidP * (60 seconds);
        timePeriodsSet = true;
    }

    //switch adminStaked to true
    function adminStake() public {
          adminStaked = true;
    }

    //log the end balance
    function logEndBal() public {
        endBalanceLogged = true;
    }

    //set hasClaimed to true
    function claim() public {
        hasClaimed[msg.sender] = true;
    }

    //test modifiers

    function testOnlyAdmin() public onlyAdmin {
        counter += 1;
    }

    function testOnlyBackupAdmin() public onlyBackupAdmin {
        counter += 1;
    }

    function testTimePeriodsNotSet() public timePeriodsNotSet {
        counter += 1;
    }

    function testOnlyReserve() public onlyReserve {
        counter += 1;
    }

    function testOnlyContributor() public onlyContributor {
        counter += 1;
    }

    function testTimePeriodsAreSet() public timePeriodsAreSet {
        counter += 1;
    }

    function testAdminHasNotStaked() public adminHasNotStaked {
        counter += 1;
    }

    function testAdminHasStaked() public adminHasStaked {
        counter += 1;
    }

    function testEndBalanceNotLogged() public endBalanceNotLogged {
        counter += 1;
    }

    function testEndBalanceIsLogged() public endBalanceIsLogged {
        counter += 1;
    }

    function testHasNotClaimed() public hasNotClaimed {
        counter += 1;
    }

    function testInAdminP() public inAdminP {
        counter += 1;
    }

    function testInRaiseP() public inRaiseP {
        counter += 1;
    }

    function testInOpperateP() public inOpperateP {
        counter += 1;
    }

    function testInOpAndLiqP() public inOpAndLiqP {
        counter += 1;
    }

    function testInLiquidP() public inLiquidP {
        counter += 1;
    }

    function testInClaimP() public inClaimP {
        counter += 1;
    }

}
