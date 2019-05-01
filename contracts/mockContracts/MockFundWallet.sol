pragma solidity 0.4.18;
//mock fund wallet for testing

import "../ERC20Interface.sol";

contract MockFundWallet {
    //experimental time periods
    uint start;
    uint adminP;
    uint raiseP;
    uint opperateP;
    uint liquidP;

    //Kyber Reserve contract address
    address public reserve;

    //eth address
    ERC20 constant internal ETH_TOKEN_ADDRESS = ERC20(0x00eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee);

    //events
    event TokenPulled(ERC20 token, uint amount, address sendTo);
    event EtherPulled(uint amount, address sendTo);

    /// @notice Constructor, initialises admin wallets.
    function MockFundWallet(uint _adminP, uint _raiseP, uint _opperateP, uint _liquidP) public {
        start = now;
        adminP = _adminP * (24 hours);
        raiseP = _raiseP * (24 hours);
        opperateP = _opperateP * (24 hours);
        liquidP = _liquidP * (24 hours);
    }

    function setReserve(address _reserve) public {
        reserve = _reserve;
    }

    function() public payable {
    }

    //functions to allow trading with reserve address

    /// @dev send erc20token to the reserve address
    /// @param token ERC20 The address of the token contract
    function pullToken(ERC20 token, uint amount) external returns (bool){
        require(msg.sender == reserve);
        require(now < (start + adminP + raiseP + opperateP + liquidP) && now > (start + adminP + raiseP));
        require(token.transfer(reserve, amount));
        TokenPulled(token, amount, reserve);
        return true;
    }

    ///@dev Send ether to the reserve address
    function pullEther(uint amount) external returns (bool){
        require(msg.sender == reserve);
        require(now < (start + adminP + raiseP + opperateP) && now > (start + adminP + raiseP));
        reserve.transfer(amount);
        EtherPulled(amount, reserve);
        return true;
    }

    ///@dev function to check balance only returns balances in opperating and liquidating periods
    function checkBalance(ERC20 token) public view returns (uint) {
        if (now < (start + adminP +raiseP + opperateP) && now > (start + adminP + raiseP)) {
            if (token == ETH_TOKEN_ADDRESS) {
                return this.balance;
            }
            else {
                return token.balanceOf(this);
            }
        }
        if (now < (start + adminP + raiseP + opperateP + liquidP) && now > (start + adminP + raiseP + opperateP)) {
            if (token == ETH_TOKEN_ADDRESS) {
                return 0;
            }
            else {
                return token.balanceOf(this);
            }
        }
        else return 0;
    }
}
