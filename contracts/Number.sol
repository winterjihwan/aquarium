// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Number {
    uint256 public number = 50;

    function increment() public {
        number++;
    }

    function decrement() public {
        number--;
    }

    function getNumber() public view returns (uint256 _number) {
        _number = number;
    }
}
