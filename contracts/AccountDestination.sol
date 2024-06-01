// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {Paymaster} from "./Paymaster.sol";

event LiquidityAdded(uint amountA, uint amountB, uint liquidity);
event LiquidityAdditionFailed(string reason);
event LowLevelLiquidityAdditionFailed(bytes lowLevelData);

contract AccountDestination is IAccount, CCIPReceiver {
  event CallResult(bool success, bytes data);

  address public owner;
  address public nativeAccount;
  uint public salt;
  address public creationAddress;
  bytes32 public latestSourceMessage;

  bytes32 private s_lastReceivedMessageId;
  bytes private s_lastReceivedTextBytes;
  string private s_lastReceivedText;

  constructor(address _owner, address _ccipRouter, address _nativeAccount) CCIPReceiver(_ccipRouter) {
    owner = _owner;
    nativeAccount = _nativeAccount;
  }

  modifier validateNativeAccount(address _nativeAccount) {
    require(_nativeAccount == nativeAccount, "Invalid native account");
    _;
  }

  //   abi.decode(any2EvmMessage.sender, (address))

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

  // ------------------------------ CCIP ------------------------------
  function encodeDataIncubation(
    uint8 multiplex,
    address token1,
    address token2,
    uint256 _amount
  ) external pure returns (bytes memory) {
    bytes memory encodedData = abi.encode(multiplex, token1, token2, _amount);

    return encodedData;
  }

  function _ccipReceive(
    Client.Any2EVMMessage memory message 
  ) validateNativeAccount(abi.decode(message.sender, (address))) internal override {
    uint8 multiplex;
    bytes memory encodedData = message.data;
    assembly {
      let dataPtr := add(encodedData, 32)
      multiplex := byte(31, mload(dataPtr))
    }

    // Initialize AA multiplexor
    if (multiplex == 0) {
      (uint8 unused, address AAFactory, bytes memory callData) = abi.decode(message.data, (uint8, address, bytes));
      (bool success, bytes memory returnData) = AAFactory.call(callData);
      require(success, "Low-level call failed");

      unused = 0;
      creationAddress = abi.decode(returnData, (address));
    }

    // Incubate Destination
    if (multiplex == 1){
      (uint8 unused, address token1, address token2, uint256 _amount) = abi.decode(message.data, (uint8, address, address, uint256));
      unused = 0;
      
      _incubateDestination(
        token1,
        token2,
        _amount,
        0,
        0,
        msg.sender,
        block.timestamp + 1000
      );
    }

    s_lastReceivedMessageId = message.messageId;
    s_lastReceivedTextBytes = message.data;
  }

  function _incubateDestination(
    address token1,
    address token2,
    uint amountToken1,
    uint amountToken1Min,
    uint amountToken2Min,
    address to,
    uint deadline
  ) internal {
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
    try
      uniswapRouter.addLiquidity(
        token1,
        token2,
        amountToken1 / 2,
        amountToken2,
        amountToken1Min,
        amountToken2Min,
        to,
        deadline
      )
    returns (uint amountA, uint amountB, uint liquidity) {
      emit LiquidityAdded(amountA, amountB, liquidity);
    } catch Error(string memory reason) {
      emit LiquidityAdditionFailed(reason);
    } catch (bytes memory lowLevelData) {
      emit LowLevelLiquidityAdditionFailed(lowLevelData);
    }
  }

  function getLastReceivedMessageDetails()
    public
    view
    returns (bytes32 messageId, string memory text, bytes memory textBytes)
  {
    return (s_lastReceivedMessageId, s_lastReceivedText, s_lastReceivedTextBytes);
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
  address public ROUTER02 = 0x641E13E0AEdf07E48205322AE19f565A81bD4ca5;
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

  // ------------------------------ FALLBACK ------------------------------
  receive() external payable {}
}
