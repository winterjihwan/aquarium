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

  uint public testNo = 0;

  function incrementTestNo() external {
    testNo++;
  }

  // Function to swap tokenA for tokenB
  function swapExactInputSingle(
    address tokenIn,
    address tokenOut,
    uint24 fee,
    uint256 amountIn,
    address to
  ) external returns (uint256 amountOut) {
    // Approve the router to spend tokenIn
    IERC20(tokenIn).approve(address(swapRouter), amountIn);

    // Set the parameters for the swap
    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      fee: fee,
      recipient: to,
      deadline: block.timestamp,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    });

    // Execute the swap
    amountOut = swapRouter.exactInputSingle(params);
  }
}
