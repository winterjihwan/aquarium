// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Incubator {
  IUniswapV2Router02 uniswapRouter;

  constructor(address _router) {
    uniswapRouter = IUniswapV2Router02(_router);
  }

  function Incubate(
    address token1,
    address token2,
    uint amountToken1,
    uint amountToken1Min,
    uint amountToken2Min,
    address to,
    uint deadline
  ) external {
    // Transfer the tokens from the user to this contract
    IERC20(token1).transferFrom(msg.sender, address(this), amountToken1);

    // Approve the router to spend the tokens
    IERC20(token1).approve(address(uniswapRouter), 10000 ether);

    // Perform the swap from token1 to token2
    address[] memory path = new address[](2);
    path[0] = token1;
    path[1] = token2;

    // First swap half of token1 to token2
    uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(
      amountToken1 / 2,
      amountToken1Min,
      path,
      address(this),
      deadline
    );

    // Add liquidity
    uint amountToken2 = amounts[1];
    IERC20(token2).approve(address(uniswapRouter), 1000 ether);
    uniswapRouter.addLiquidity(
      token1,
      token2,
      amountToken1 / 2,
      amountToken2,
      amountToken1Min,
      amountToken2Min,
      to,
      deadline
    );
  }
}
