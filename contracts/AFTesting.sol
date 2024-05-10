// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AccountFactory} from "./AccountFactory.sol";

contract AFTesting {
  AccountFactory public AF;
  address public creationAddress;

  function encodeData(
    uint8 multiplex,
    address AAFactory,
    address AAUser,
    address router
  ) external pure returns (bytes memory) {
    bytes memory callData = abi.encodeWithSignature("createAccount(address,address)", AAUser, router);
    bytes memory encodedData = abi.encode(multiplex, AAFactory, callData);

    return encodedData;
  }

  function onReceive(bytes memory message) external returns (address) {
    (uint8 multiplex, address AAFactory, bytes memory callData) = abi.decode(message, (uint8, address, bytes));

    address addr;

    if (multiplex == 0) {
      // Perform a low-level call to the `call()` function of AAFactory
      (bool success, bytes memory returnData) = AAFactory.call(callData);
      require(success, "Low-level call failed");

      // Decode the address returned from the call if applicable
      addr = abi.decode(returnData, (address));
      creationAddress = addr;
    }
    return addr;
  }

  //   callback
  receive() external payable {}
}
