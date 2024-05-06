// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract Account is IAccount {
  event CallResult(bool success, bytes data);

  uint256 public count;
  address public owner;

  constructor(address _owner) {
    owner = _owner;
  }

  function validateUserOp(
    UserOperation calldata userOp,
    bytes32 userOpHash,
    uint256
  ) external view returns (uint256 validationData) {
    address recovered = ECDSA.recover(toEthSignedMessageHash(userOpHash), userOp.signature);

    return owner == recovered ? 0 : 1;
  }

  function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32 message) {
    assembly {
      mstore(0x00, "\x19Ethereum Signed Message:\n32")
      mstore(0x1c, hash)
      message := keccak256(0x00, 0x3c)
    }
  }

  function execute(address target, bytes memory data) public payable {
    (bool success, bytes memory result) = target.call(data);
    require(success, "Call failed");
    emit CallResult(success, result);
  }
}
