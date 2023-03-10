// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "./hETH.sol";

contract BridgeOut {
    address public admin;
    hETH public token;
    mapping(address => mapping(uint256 => bool)) public processedNonces;
    enum Step {
        Burn,
        Mint
    }
    event Transfer(
        address from,
        address to,
        uint256 amount,
        uint256 date,
        uint256 nonce,
        bytes signature
        // Step indexed step
    );

    constructor(address _token) {
        admin = msg.sender;
        token = hETH(_token);
    }

    function mint(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        bytes32 message = prefixed(
            keccak256(abi.encodePacked(from, to, amount, nonce))
        );
        require(msg.sender == admin);
        require(recoverSigner(message, signature) == from, "wrong signature");
        require(
            processedNonces[from][nonce] == false,
            "transfer already processed"
        );
        processedNonces[from][nonce] = true;
        token.mint(to, amount);
        emit Transfer(from, to, amount, block.timestamp, nonce, signature);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function recoverSigner(bytes32 message, bytes memory sig)
        internal
        pure
        returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            uint8,
            bytes32,
            bytes32
        )
    {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }
}
