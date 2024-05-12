// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IPaymaster.sol";
import "./StakeManager.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

  function ccipFeeOnBehalf(
    uint64 _destinationChainSelector,
    address _sourceRouter,
    Client.EVM2AnyMessage memory evm2AnyMessage
  ) external returns (bytes32 messageId) {
    IRouterClient router = IRouterClient(_sourceRouter);
    uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

    if (fees > address(this).balance) revert("Not enough balance");

    messageId = router.ccipSend{value: fees}(_destinationChainSelector, evm2AnyMessage);
  }

  function ccipFeeOnBehalfToken(
    uint64 _destinationChainSelector,
    address _sourceRouter,
    Client.EVM2AnyMessage memory evm2AnyMessage,
    address token,
    uint256 amount
  ) external returns (bytes32 messageId) {
    IRouterClient router = IRouterClient(_sourceRouter);
    uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

    if (fees > address(this).balance) revert("Not enough balance");

    IERC20(token).transferFrom(msg.sender, address(this), amount);
    IERC20(token).approve(address(router), amount);

    messageId = router.ccipSend{value: fees}(_destinationChainSelector, evm2AnyMessage);
  }
}
