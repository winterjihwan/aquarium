// SPDX-License-Identifier: MIT

import {INumber} from "./INumber.sol";

pragma solidity ^0.8.7;

contract Encode {
  bytes data;

  function encodeNumber(
    uint8 multiplex,
    address number_address
  ) external pure returns (bytes memory callData, bytes memory encodeData) {
    callData = abi.encodeWithSignature("increment()");
    encodeData = abi.encode(multiplex, number_address, callData);
  }

  function decodeAndExecute(bytes memory encodedData) external returns (bool success) {
    (uint8 multiplex, address number_address, bytes memory callData) = abi.decode(encodedData, (uint8, address, bytes));

    if (multiplex == 1) {
      (success, ) = number_address.call(callData);

      require(success, "Low-level call failed");
    } else {
      success = false;
    }
  }
}
