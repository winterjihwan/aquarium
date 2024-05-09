// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Interface for the Number contract
interface INumber {
  function increment() external;

  function decrement() external;

  function getNumber() external view returns (uint256 _number);
}
