// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Account is IAccount {
  event CallResult(bool success, bytes data);

  address public owner;
  uint private salt;

  constructor(address _owner) {
    owner = _owner;
  }

  function initAA() external {
    salt = 0;
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

  // ------------------------------ DEPOSIT, WITHDRAW ------------------------------
  function depositToken(address token, uint256 amount) public {
    require(amount > 0, "Amount must be greater than 0");
    require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
  }

  function withdrawToken(address token, uint256 amount) public {
    require(amount > 0, "Amount must be greater than 0");
    require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient balance");
    require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
  }

  function getTokenBalance(address token) public view returns (uint256) {
    return IERC20(token).balanceOf(address(this));
  }

  // ------------------------------ STAKING ------------------------------
  address public ROUTER02 = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008;
  IUniswapV2Router02 public uniswapRouter = IUniswapV2Router02(ROUTER02);

  function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external {
    IERC20(tokenA).approve(ROUTER02, amountA * 3);
    IERC20(tokenB).approve(ROUTER02, amountB * 3);

    uniswapRouter.addLiquidity(
      tokenA,
      tokenB,
      amountA,
      amountB,
      0,
      0,
      address(this),
      block.timestamp + 300 // 5 minutes deadline
    );
  }

  function liquidateLiquidity(
    address tokenA,
    address tokenB,
    address pair,
    uint256 liquidity
  ) external returns (uint256 amountA, uint256 amountB) {
    IERC20(pair).approve(ROUTER02, liquidity * 2);

    (amountA, amountB) = uniswapRouter.removeLiquidity(
      tokenA,
      tokenB,
      liquidity,
      0,
      0,
      address(this),
      block.timestamp + 300
    );
  }
}
