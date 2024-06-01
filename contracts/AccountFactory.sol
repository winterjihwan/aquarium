// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "./AccountNative.sol";

event AccountCreated(address account);

struct User {
  string id;
  bytes32[2] publicKey;
  address account;
}

contract AccountFactory {
  bytes32 public constant SALT = keccak256("aquarium");
  AccountNative public immutable accountImplementation;

  mapping(string id => User user) public users;

  function saveUser(string memory id, bytes32[2] memory publicKey) external {
    users[id] = User(id, publicKey, this.getCounterfactualAddress(publicKey));
  }

  function getUser(string memory id) external view returns (User memory) {
    return users[id];
  }

  function getCounterfactualAddress(bytes32[2] memory publicKey) public view returns (address) {
    return
      Create2.computeAddress(
        SALT,
        keccak256(
          abi.encodePacked(
            type(ERC1967Proxy).creationCode,
            abi.encode(address(accountImplementation), abi.encodeCall(AccountNative.initialize, (publicKey)))
          )
        )
      );
  }

  function createAccount(bytes32[2] memory publicKey) external payable returns (AccountNative) {
    address addr = getCounterfactualAddress(publicKey);

    uint codeSize = addr.code.length;
    if (codeSize > 0) {
      return AccountNative(payable(addr));
    }

    return
      AccountNative(
        payable(
          new ERC1967Proxy{salt: SALT}(address(accountImplementation), abi.encodeCall(AccountNative.initialize, (publicKey)))
        )
      );
  }

  constructor(address _ccipRouter){
    accountImplementation = new AccountNative(msg.sender, _ccipRouter);
  }
}
