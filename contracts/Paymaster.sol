// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol";
import "./StakeManager.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Paymaster is IPaymaster, StakeManager {
  function validatePaymasterUserOp(
    UserOperation calldata,
    bytes32,
    uint256
  ) external pure returns (bytes memory context, uint256 validationData) {
    context = new bytes(0);
    validationData = 0;
  }

  //   function externalPaymasterFund(
  //     UserOperation calldata userOp,
  //     bytes32 userOpHash,
  //     uint256 requiredPreFund
  //   ) external returns (bytes memory context, uint256 validationData) {
  //     context = new bytes(0);
  //     address sender = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);
  //     DepositInfo storage externalPaymaster = deposits[sender];
  //     uint256 deposit = externalPaymaster.deposit;
  //     validationData = 1;
  //     unchecked {
  //       if (deposit >= requiredPreFund) {
  //         externalPaymaster.deposit = uint112(deposit - requiredPreFund);
  //         validationData = 0;
  //       }
  //     }
  //   }

  /**
   * post-operation handler.
   * Must verify sender is the entryPoint
   * @param mode enum with the following options:
   *      opSucceeded - user operation succeeded.
   *      opReverted  - user op reverted. still has to pay for gas.
   *      postOpReverted - user op succeeded, but caused postOp (in mode=opSucceeded) to revert.
   *                       Now this is the 2nd call, after user's op was deliberately reverted.
   * @param context - the context value returned by validatePaymasterUserOp
   * @param actualGasCost - actual gas used so far (without this postOp call).
   */
  function postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) external {}
}
