// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Importing interfaces from Uniswap V3
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract SwapUniswapV3 {
  ISwapRouter public immutable swapRouter;

  // Set the address for the Uniswap v3 SwapRouter
  constructor(address _swapRouter) {
    swapRouter = ISwapRouter(_swapRouter);
  }

  // Function to swap exact input of one token for another token
  function swapExactInputSingle(
    uint256 amountIn,
    uint256 amountOutMinimum,
    address tokenIn,
    address tokenOut,
    uint24 fee
  ) external returns (uint256 amountOut) {
    // Transfer the specified amount of tokenIn to this contract
    TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this), amountIn);

    // Approve the router to spend tokenIn
    TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

    // Single swap parameters
    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      fee: fee,
      recipient: msg.sender,
      deadline: block.timestamp + 15 minutes,
      amountIn: amountIn,
      amountOutMinimum: amountOutMinimum,
      sqrtPriceLimitX96: 0
    });

    // Execute the swap
    amountOut = swapRouter.exactInputSingle(params);
  }
}
