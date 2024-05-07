// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapV3SwapHelper {
  ISwapRouter public immutable swapRouter;

  // Address of the Uniswap V3 SwapRouter
  constructor(address _swapRouter) {
    swapRouter = ISwapRouter(_swapRouter);
  }

  // Function to swap tokenA for tokenB
  function swapTokenForToken(
    address tokenIn,
    address tokenOut,
    uint24 fee,
    uint256 amountIn,
    uint256 amountOutMin,
    address to
  ) external {
    // Transfer the specified amount of tokenIn to this contract
    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

    // Approve the router to spend tokenIn
    IERC20(tokenIn).approve(address(swapRouter), amountIn);

    // Set the parameters for the swap
    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      fee: fee,
      recipient: to,
      deadline: block.timestamp + 15 minutes,
      amountIn: amountIn,
      amountOutMinimum: amountOutMin,
      sqrtPriceLimitX96: 0
    });

    // Execute the swap
    swapRouter.exactInputSingle(params);
  }
}
