// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Multicall {
  struct call {
    address target;
    bytes callData;
  }

  function aggregate(call[] memory calls) public returns (uint256 blockNumber, bytes[] memory returnData) {
    blockNumber = block.number;
    returnData = new bytes[](calls.length);
    for (uint i = 0; i < calls.length; i++) {
      (bool success, bytes memory data) = calls[i].target.call(calls[i].callData);
      require(success);
      returnData[i] = data;
    }
  }
}
