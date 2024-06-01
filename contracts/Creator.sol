// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {Paymaster} from "./Paymaster.sol";

event CreatedAccount(address account);

contract Creator is CCIPReceiver {
  event CallResult(bool success, bytes data);

  address public owner;
  address public creationAddress;
  bytes32 public latestSourceMessage;

  bytes32 private s_lastReceivedMessageId;
  bytes private s_lastReceivedTextBytes;
  string private s_lastReceivedText;

  // address nativeAccount = abi.decode(message.sender, (address));
  //   address AAUser;
  //   address router;

  //   {
  //     assembly {
  //       AAUser := mload(add(callData, 36))
  //       router := mload(add(callData, 68))
  //     }
  //   }

  address public d_nativeAccount;
  address public d_AAUser;
  address public d_router;
  address public d_AAFactory;
  uint8 public d_multiplex;

  constructor(address _owner, address _ccipRouter) CCIPReceiver(_ccipRouter) {
    owner = _owner;
  }

  // ------------------------------ CCIP ------------------------------
  function encodeData(
    uint8 multiplex,
    address AAFactory,
    address AAUser,
    address router
  ) internal pure returns (bytes memory) {
    bytes memory callData = abi.encodeWithSignature("createAccount(address,address)", AAUser, router);
    bytes memory encodedData = abi.encode(multiplex, AAFactory, callData);

    return encodedData;
  }

  function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
    (uint8 multiplex, address AAFactory, bytes memory callData) = abi.decode(message.data, (uint8, address, bytes));
    address nativeAccount = abi.decode(message.sender, (address));
    address AAUser;
    address router;

    {
      assembly {
        AAUser := mload(add(callData, 36))
        router := mload(add(callData, 68))
      }
    }

    bytes memory modifiedCallData = abi.encodeWithSignature(
      "createAccount(address,address,address)",
      AAUser,
      router,
      nativeAccount
    );

    d_AAFactory = AAFactory;
    d_nativeAccount = nativeAccount;
    d_AAUser = AAUser;
    d_router = router;
    d_multiplex = multiplex;

    // Initialize AA multiplexor
    if (multiplex == 0) {
      (bool success, bytes memory returnData) = AAFactory.call(modifiedCallData);
      require(success, "Low-level call failed");

      creationAddress = abi.decode(returnData, (address));
      emit CreatedAccount(creationAddress);
    }

    s_lastReceivedMessageId = message.messageId;
    s_lastReceivedText = abi.decode(message.data, (string));
    s_lastReceivedTextBytes = message.data;
  }

  function getLastReceivedMessageDetails()
    public
    view
    returns (bytes32 messageId, string memory text, bytes memory textBytes)
  {
    return (s_lastReceivedMessageId, s_lastReceivedText, s_lastReceivedTextBytes);
  }

  // ------------------------------ FALLBACK ------------------------------
  receive() external payable {}
}
