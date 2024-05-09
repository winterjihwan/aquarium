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

contract Account is IAccount, CCIPReceiver {
  event CallResult(bool success, bytes data);

  address public owner;
  uint public salt;

  bytes32 private s_lastReceivedMessageId;
  string private s_lastReceivedText;

  constructor(address _owner, address _ccipRouter) CCIPReceiver(_ccipRouter) {
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

  // ------------------------------ CCIP ------------------------------
  function AAInitializeDestination(
    uint64 _destinationChainSelector,
    address _receiver,
    address AAFactory,
    address AAUser,
    address destinationRouter
  ) external returns (bytes32 messageId) {
    Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](0);
    // Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
    // tokenAmounts[0] = Client.EVMTokenAmount({token: _token, amount: _amount});

    bytes memory encodedData = encodeData(0, AAFactory, AAUser, destinationRouter);

    Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
      receiver: abi.encode(_receiver),
      data: encodedData,
      tokenAmounts: tokenAmounts,
      extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 200_000})),
      feeToken: address(0)
    });

    IRouterClient router = IRouterClient(this.getRouter());

    uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);
    if (fees > address(this).balance) revert("Not enough balance");

    messageId = router.ccipSend{value: fees}(_destinationChainSelector, evm2AnyMessage);
    return messageId;
  }

  function encodeData(
    uint8 multiplex,
    address AAFactory,
    address AAUser,
    address router
  ) internal pure returns (bytes memory) {
    bytes memory callData = abi.encodeWithSignature("initialize()", AAUser, router);
    bytes memory encodedData = abi.encode(multiplex, AAFactory, callData);

    return encodedData;
  }

  function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
    (uint8 multiplex, address AAFactory, bytes memory callData) = abi.decode(message.data, (uint8, address, bytes));

    salt = 1;

    // Initialize AA multiplexor
    if (multiplex == 1) {
      (bool success, ) = AAFactory.call(callData);

      require(success, "Low-level call failed");
    }

    s_lastReceivedMessageId = message.messageId;
    s_lastReceivedText = abi.decode(message.data, (string));
  }

  function getLastReceivedMessageDetails() public view returns (bytes32 messageId, string memory text) {
    return (s_lastReceivedMessageId, s_lastReceivedText);
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

  // ------------------------------ FALLBACK ------------------------------
  receive() external payable {}
}
