// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract hETH is ERC20 {
    address public admin;

    constructor() ERC20("hETH", "hETH") {
        admin = msg.sender;
    }

    function mint(address reciever, uint256 amount) external {
        require(msg.sender == admin);
        _mint(reciever, amount);
    }
}
