// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract BridgeIn {
    mapping(address => mapping(uint256 => bool)) public processedNonces;
    event Transfer(
        address from,
        address to,
        uint256 amount,
        uint256 date,
        uint256 nonce,
        bytes signature
    );

    constructor() {}

    function bridge(
        address to,
        uint256 nonce,
        bytes calldata signature
    ) external payable {
        require(
            processedNonces[msg.sender][nonce] == false,
            "transfer already processed"
        );
        processedNonces[msg.sender][nonce] = true;
        emit Transfer(
            msg.sender,
            to,
            msg.value,
            block.timestamp,
            nonce,
            signature
        );
    }
}
