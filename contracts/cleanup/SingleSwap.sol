// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.7;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface IERC20 {
  function balanceOf(address account) external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function approve(address spender, uint256 amount) external returns (bool);
}

contract SingleSwap {
  address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
  ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

  address public constant LINK = 0x4f7A67464B5976d7547c860109e4432d50AfB38e;
  address public constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;

  IERC20 public wethToken = IERC20(WETH);

  uint24 public constant poolFee = 3000;

  constructor() {}

  function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut) {
    wethToken.approve(address(swapRouter), amountIn);

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
      tokenIn: WETH,
      tokenOut: LINK,
      fee: poolFee,
      recipient: address(this),
      deadline: block.timestamp,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    });

    amountOut = swapRouter.exactInputSingle(params);
  }
}
